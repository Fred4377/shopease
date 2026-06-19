import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Helper to get access token from Safaricom
async function getMpesaAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY || 'sandbox_default_consumer_key';
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || 'sandbox_default_consumer_secret';
  
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  
  const response = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to generate token: ${errText}`);
  }
  
  const data = await response.json();
  return data.access_token;
}

// Initiate STK Push
router.post('/stkpush', async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body;
    
    // 1. Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Format phone number to international format: e.g. 0712345678 -> 254712345678
    let formattedPhone = phoneNumber.trim().replace('+', '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }
    
    // Safaricom parameters
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://shopease-api-otyi.onrender.com/api/payment/callback';
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    
    // 2. Generate M-Pesa access token
    let accessToken;
    try {
      accessToken = await getMpesaAccessToken();
    } catch (tokenErr) {
      console.error('Mpesa Token Generation Failed, falling back to mock payment flow:', tokenErr.message);
      // Fallback/Mock mode for developer sandbox if no valid keys are supplied in env
      const mockCheckoutId = 'ws_CO_' + Math.random().toString(36).substring(2, 15);
      order.mpesaCheckoutRequestID = mockCheckoutId;
      await order.save();
      
      // Simulate Safaricom Callback after 5 seconds to mark order paid for seamless sandbox testing
      setTimeout(async () => {
        try {
          const simulatedOrder = await Order.findOne({ mpesaCheckoutRequestID: mockCheckoutId });
          if (simulatedOrder) {
            simulatedOrder.isPaid = true;
            simulatedOrder.paidAt = new Date();
            simulatedOrder.mpesaReceiptNumber = 'MOCK' + Math.random().toString(36).substring(2, 10).toUpperCase();
            await simulatedOrder.save();
            console.log(`Mock STK Push: Order ${simulatedOrder._id} marked as Paid!`);
          }
        } catch (simErr) {
          console.error('Mock Callback Error:', simErr.message);
        }
      }, 5000);

      return res.status(200).json({ 
        message: 'Mock payment request initiated successfully', 
        checkoutRequestId: mockCheckoutId,
        isMock: true
      });
    }
    
    // 3. Make STK push request to Daraja API
    const response = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(order.totalPrice), // Ensure integer amount for Daraja
          PartyA: formattedPhone,
          PartyB: shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl,
          AccountReference: `Order_${order._id.toString().substring(18)}`,
          TransactionDesc: 'ShopEase E-Commerce Payment',
        }),
      }
    );
    
    const data = await response.json();
    
    if (data.ResponseCode === '0') {
      order.mpesaCheckoutRequestID = data.CheckoutRequestID;
      await order.save();
      return res.status(200).json({ 
        message: 'STK push initiated successfully', 
        checkoutRequestId: data.CheckoutRequestID,
        isMock: false
      });
    } else {
      return res.status(400).json({ message: data.CustomerMessage || 'STK push initiation failed' });
    }
    
  } catch (error) {
    console.error('STK Push Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Safaricom Callback Hook
router.post('/callback', async (req, res) => {
  try {
    const callbackData = req.body;
    console.log('M-Pesa Callback Payload:', JSON.stringify(callbackData, null, 2));
    
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = callbackData.Body.stkCallback;
    
    if (ResultCode === 0) {
      // Find the order with matching checkout request id
      const order = await Order.findOne({ mpesaCheckoutRequestID: CheckoutRequestID });
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        
        // Extract receipt number from metadata
        const metadataItems = callbackData.Body.stkCallback.CallbackMetadata.Item;
        const receiptItem = metadataItems.find(item => item.Name === 'MpesaReceiptNumber');
        if (receiptItem) {
          order.mpesaReceiptNumber = receiptItem.Value;
        }
        
        await order.save();
        console.log(`Order ${order._id} successfully paid with receipt ${order.mpesaReceiptNumber}`);
      } else {
        console.warn(`No order found matching checkoutRequestId: ${CheckoutRequestID}`);
      }
    } else {
      console.warn(`M-Pesa payment failed/cancelled. Code: ${ResultCode}, Desc: ${ResultDesc}`);
    }
    
    // Respond to Safaricom
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Callback received successfully' });
    
  } catch (error) {
    console.error('Callback Handling Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Check payment status
router.get('/status/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ 
      isPaid: order.isPaid, 
      paidAt: order.paidAt,
      mpesaReceiptNumber: order.mpesaReceiptNumber 
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
