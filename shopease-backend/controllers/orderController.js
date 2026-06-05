import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create a new order
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      // tbh frontend should prevent this but just in case
      res.status(400).json({ message: 'No items in the cart bro' });
      return;
    } else {
      const newClientOrder = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      const savedOrder = await newClientOrder.save();
      
      // reduce stock
      // TODO: what happens if multiple people buy at the exact same time?
      for (const item of orderItems) {
        Product.findById(item.product).then(foundItem => {
          if (foundItem) {
            foundItem.stock = foundItem.stock - item.qty;
            foundItem.save();
          }
        }).catch(err => console.log("stock update failed: ", err));
      }

      res.status(201).json(savedOrder);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single order
const getOrderById = async (req, res) => {
  try {
    const requestedOrder = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (requestedOrder) {
      res.json(requestedOrder);
    } else {
      res.status(404).json({ message: 'Order not found in db' });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// fetching user's own orders
function getMyOrders(req, res) {
  // using promises here, await was acting weird
  Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .then(customerOrders => {
      res.json(customerOrders);
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
};

// get all orders for admin dashboard
const getOrders = async (req, res) => {
  try {
    // TODO: definitely need to add pagination here soon, it's gonna crash if we get too many orders
    const allShopOrders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(allShopOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mark as delivered
const updateOrderToDelivered = async (req, res) => {
  try {
    const targetOrder = await Order.findById(req.params.id);

    if (targetOrder) {
      targetOrder.isDelivered = true;
      targetOrder.deliveredAt = Date.now();
      
      // auto update payment if they pay on delivery
      // Note to self: need to add M-Pesa stk push callback logic here eventually
      if (targetOrder.paymentMethod === 'Cash on Delivery' || targetOrder.paymentMethod === 'M-Pesa') {
        targetOrder.isPaid = true;
        targetOrder.paidAt = Date.now();
      }

      const updated = await targetOrder.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Could not find order to deliver' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
