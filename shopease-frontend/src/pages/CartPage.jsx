import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, itemsPrice, shippingPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/login?redirect=checkout');
  };

  return (
    <div className="container py-5 cart-page">
      <h1 className="mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart text-center py-5">
          <div className="empty-cart-icon mb-3">🛒</div>
          <h2>Your cart is empty</h2>
          <p className="mb-4">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-info">
                  <Link to={`/product/${item.product}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <div className="cart-item-price">KSh {(item.price * 100).toLocaleString()}</div>
                </div>

                <div className="cart-item-qty">
                  <div className="qty-controls">
                    <button 
                      onClick={() => updateQuantity(item.product, Math.max(1, item.qty - 1))}
                      disabled={item.qty <= 1}
                    >-</button>
                    <input type="number" value={item.qty} readOnly />
                    <button 
                      onClick={() => updateQuantity(item.product, Math.min(item.countInStock, item.qty + 1))}
                      disabled={item.qty >= item.countInStock}
                    >+</button>
                  </div>
                </div>

                <div className="cart-item-subtotal">
                  KSh {(item.price * item.qty * 100).toLocaleString()}
                </div>

                <button 
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.product)}
                >
                  🗑️
                </button>
              </div>
            ))}
            
            <div className="mt-4">
              <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
              <span>KSh {(itemsPrice * 100).toLocaleString()}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping:</span>
              <span>
                {shippingPrice === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  `KSh ${(shippingPrice * 100).toLocaleString()}`
                )}
              </span>
            </div>
            
            {shippingPrice > 0 && (
              <div className="shipping-notice mb-3 text-secondary" style={{fontSize: '0.85rem'}}>
                Free shipping on orders over KSh 5,000!
              </div>
            )}
            
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>KSh {(totalPrice * 100).toLocaleString()}</span>
            </div>
            
            <button 
              className="btn btn-primary btn-block mt-4" 
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
