import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.slice(0, 8)); // Get latest 8 products
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Books', icon: '📚' },
    { name: 'Home', icon: '🏠' },
    { name: 'Sports', icon: '⚽' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <h1>Shop Everything You Love</h1>
          <p>Discover premium products, amazing deals, and a seamless shopping experience.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
            <Link to="/products" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>View All Products</Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="category-section container py-5">
        <h2 className="text-center mb-4">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="category-card"
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container py-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-4 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div className="text-center mt-4">
          <Link to="/products" className="btn btn-outline">View More</Link>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="features-section container py-5 mb-5">
        <h2 className="text-center mb-4">Why Shop With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast Delivery</h3>
            <p>Get your products delivered quickly and safely to your doorstep.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payment</h3>
            <p>Your transactions are encrypted and 100% secure.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Easy Returns</h3>
            <p>Not satisfied? Return products easily within 30 days.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎧</div>
            <h3>24/7 Support</h3>
            <p>Our support team is always here to help you out.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
