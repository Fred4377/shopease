import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Alert from '../components/Alert';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, itemsPrice, shippingPrice, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: 'Nairobi CBD',
    phoneNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // M-Pesa STK push simulation state
  const [showStkModal, setShowStkModal] = useState(false);
  const [stkPin, setStkPin] = useState('');
  const [stkStatus, setStkStatus] = useState('pending'); // pending, processing, success

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: itemsPrice * 100,
        shippingPrice: shippingPrice * 100,
        totalPrice: totalPrice * 100,
      });

      if (paymentMethod === 'Cash on Delivery') {
        clearCart();
        navigate(`/order-success/${data._id}`);
      }
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitOrderFormHandler = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (paymentMethod === 'Lipa na M-Pesa') {
      if (!mpesaPhone) {
        setError("Please enter a valid M-Pesa phone number.");
        return;
      }
      setLoading(true);
      try {
        // 1. Place order with isPaid = false
        const orderData = await placeOrderHandler();
        
        // 2. Trigger STK push
        setStkStatus('processing');
        setShowStkModal(true);
        
        await api.post('/payment/stkpush', {
          orderId: orderData._id,
          phoneNumber: mpesaPhone
        });
        
        // 3. Start polling for status
        let pollCount = 0;
        const maxPoll = 24; // 24 * 2.5s = 60 seconds
        const pollInterval = setInterval(async () => {
          pollCount++;
          try {
            const { data: statusRes } = await api.get(`/payment/status/${orderData._id}`);
            if (statusRes.isPaid) {
              clearInterval(pollInterval);
              setStkStatus('success');
              clearCart();
              setTimeout(() => {
                setShowStkModal(false);
                navigate(`/order-success/${orderData._id}`);
              }, 2000);
            }
          } catch (err) {
            console.error('Polling error:', err);
          }
          
          if (pollCount >= maxPoll) {
            clearInterval(pollInterval);
            setStkStatus('failed');
            setError("STK push transaction timed out. Please check your phone or try again.");
            setTimeout(() => {
              setShowStkModal(false);
            }, 3000);
          }
        }, 2500);
        
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setShowStkModal(false);
      } finally {
        setLoading(false);
      }
    } else {
      placeOrderHandler();
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>Checkout</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="checkout-form-container">
          <div className="card p-4" style={{ background: 'var(--card-bg)' }}>
            <h2 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>Shipping Information</h2>
            <form onSubmit={submitOrderFormHandler}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="fullName"
                  value={shippingAddress.fullName} 
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Delivery Address (Street/Apartment/Office)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="address"
                  value={shippingAddress.address} 
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Nairobi Area</label>
                  <select 
                    className="form-control" 
                    name="city"
                    value={shippingAddress.city} 
                    onChange={handleChange}
                    required
                  >
                    <option value="Nairobi CBD">Nairobi CBD</option>
                    <option value="Westlands">Westlands</option>
                    <option value="Kilimani">Kilimani</option>
                    <option value="Kasarani">Kasarani</option>
                    <option value="Lang'ata">Lang'ata</option>
                    <option value="Karen">Karen</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Contact Phone Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="phoneNumber"
                    placeholder="e.g. 0712345678"
                    value={shippingAddress.phoneNumber} 
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <h2 className="mb-3 mt-4" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>Payment Method</h2>
              <div className="form-group flex flex-col gap-3">
                <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Lipa na M-Pesa"
                    checked={paymentMethod === 'Lipa na M-Pesa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Lipa na M-Pesa (STK Push)</span>
                </label>
              </div>

              {paymentMethod === 'Lipa na M-Pesa' && (
                <div className="bg-light p-3 rounded mb-3 border border-dashed" style={{ borderColor: 'var(--primary-teal)' }}>
                  <label className="form-label font-bold">M-Pesa Mobile Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 0712345678"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    required
                  />
                  <small className="text-muted block mt-1">An instant Safaricom STK push will be sent to this line.</small>
                </div>
              )}

              <button 
                type="submit"
                className="btn btn-primary btn-block mt-4"
                disabled={loading}
              >
                {loading ? 'Processing...' : paymentMethod === 'Lipa na M-Pesa' ? 'Trigger M-Pesa Checkout' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        <div className="checkout-summary">
          <div className="card p-4" style={{ background: 'var(--card-bg)' }}>
            <h2 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>Order Summary</h2>
            
            <div className="checkout-items mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item.product} className="flex justify-between items-center mb-3 pb-3" style={{borderBottom: '1px solid var(--border-color)'}}>
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <div style={{fontWeight: '600', fontSize: '0.9rem'}}>{item.name}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Qty: {item.qty}</div>
                    </div>
                  </div>
                  <div style={{fontWeight: '600'}}>KSh {(item.price * item.qty * 100).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>KSh {(itemsPrice * 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-3 pb-3" style={{borderBottom: '1px solid var(--border-color)'}}>
              <span>Shipping Fee:</span>
              <span>{shippingPrice === 0 ? 'Free' : `KSh ${(shippingPrice * 100).toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between mb-4" style={{fontSize: '1.25rem', fontWeight: '700'}}>
              <span>Total:</span>
              <span style={{ color: 'var(--primary-teal)' }}>KSh {(totalPrice * 100).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Phone Pop-up modal for Lipa na M-Pesa STK push */}
      {showStkModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div className="p-6 bg-white border rounded-[40px] shadow-2xl relative" style={{ width: '300px', background: '#111', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="w-24 h-4 bg-black rounded-b-xl mx-auto -mt-6 mb-6"></div>

            <div className="p-5 bg-black rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg font-bold">M</div>
              
              <div className="space-y-1">
                <h3 className="text-white text-sm font-bold">Lipa na M-Pesa</h3>
                <p className="text-xs text-gray-400">ShopEase Checkout System</p>
              </div>

              {stkStatus === 'processing' && (
                <div className="py-6 space-y-4 w-full flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-300">STK push sent to +254{mpesaPhone.slice(-9)}</p>
                  <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Please enter your M-Pesa PIN on your phone to complete the transaction.</p>
                </div>
              )}

              {stkStatus === 'success' && (
                <div className="py-6 space-y-3 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl font-bold">✓</div>
                  <p className="text-xs text-emerald-400 font-bold">Payment Successful!</p>
                  <p className="text-[10px] text-gray-400">Placing your order...</p>
                </div>
              )}

              {stkStatus === 'failed' && (
                <div className="py-6 space-y-3 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white text-xl font-bold">✗</div>
                  <p className="text-xs text-red-400 font-bold">Payment Failed</p>
                  <p className="text-[10px] text-gray-400">Request timed out or declined.</p>
                </div>
              )}
            </div>
            
            <div className="w-20 h-1 bg-neutral-800 rounded-full mx-auto mt-5"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
