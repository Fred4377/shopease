import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="footer-col">
          <h3>ShopEase</h3>
          <p>
            Your one-stop destination for everything you love. Experience
            seamless shopping with top-notch quality and service.
          </p>
        </div>
        
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/products?category=Electronics">Electronics</Link></li>
            <li><Link to="/products?category=Clothing">Clothing</Link></li>
            <li><Link to="/products?category=Books">Books</Link></li>
            <li><Link to="/products?category=Home">Home</Link></li>
            <li><Link to="/products?category=Sports">Sports</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>Contact Info</h3>
          <ul>
            <li>Email: support@shopease.com</li>
            <li>Phone: +1 234 567 890</li>
            <li>Address: 123 E-Commerce St, Tech City</li>
          </ul>
          <div className="social-icons">
            <span>FB</span>
            <span>TW</span>
            <span>IG</span>
            <span>LI</span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
