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
    city: '',
    phoneNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Checkout</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="checkout-form-container">
          <div className="card p-4">
            <h2 className="mb-4">Shipping Information</h2>
            <form onSubmit={placeOrderHandler}>
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
                <label className="form-label">Address</label>
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
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="city"
                    value={shippingAddress.city} 
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="phoneNumber"
                    value={shippingAddress.phoneNumber} 
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <h2 className="mb-3 mt-4">Payment Method</h2>
              <div className="form-group">
                <label className="filter-label">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>
              </div>
            </form>
          </div>
        </div>

        <div className="checkout-summary">
          <div className="card p-4">
            <h2 className="mb-4">Order Summary</h2>
            
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
                  <div style={{fontWeight: '600'}}>${(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-2">
              <span>Items:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 pb-3" style={{borderBottom: '1px solid var(--border-color)'}}>
              <span>Shipping:</span>
              <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between mb-4" style={{fontSize: '1.25rem', fontWeight: '700'}}>
              <span>Total:</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary btn-block" 
              onClick={placeOrderHandler}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
