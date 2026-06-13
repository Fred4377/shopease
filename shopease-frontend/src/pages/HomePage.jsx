import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import './HomePage.css';

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    // using .then() here because async/await was throwing weird warnings with the linter
    api.get('/products')
      .then(response => {
        const { data: allStoreItems } = response;
        // just grab the latest 8 for the homepage
        setFeaturedItems(allStoreItems.slice(0, 8));
        setIsLoading(false);
      })
      .catch(err => {
        console.error("failed to grab products:", err);
        setFetchError(err.response?.data?.message || err.message);
        setIsLoading(false);
      });
  }, []);

  // Set up vanilla intersection observer for scroll animations
  useEffect(() => {
    // TODO: might refactor this later to a custom hook if I need it on other pages
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            // stop observing once it animates
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 } // trigger when 15% visible
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  const storeCategories = [
    { label: 'Electronics', emoji: '💻' },
    { label: 'Clothing', emoji: '👕' },
    { label: 'Books', emoji: '📚' },
    { label: 'Home', emoji: '🏠' },
    { label: 'Sports', emoji: '⚽' },
  ];

  return (
    <div className="home-page" ref={pageRef}>
      {/* Hero Section */}
      <section className="hero-section animate-on-scroll" style={{ opacity: 0 }}>
        <div className="container hero-content">
          <h1>Shop Everything You Love</h1>
          <p>Discover premium products, amazing deals, and a seamless shopping experience.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
            <Link to="/products" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>View All Products</Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="category-section container py-5 animate-on-scroll" style={{ opacity: 0 }}>
        <h2 className="text-center mb-4">Shop by Category</h2>
        <div className="category-grid">
          {storeCategories.map((cat, idx) => (
            <div 
              key={idx} 
              className="category-card"
              onClick={() => navigate(`/products?category=${cat.label}`)}
            >
              <div className="category-icon">{cat.emoji}</div>
              <h3>{cat.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container py-5 animate-on-scroll" style={{ opacity: 0 }}>
        <h2 className="text-center mb-4">Featured Products</h2>
        {isLoading ? (
          <Loader />
        ) : fetchError ? (
          <Alert variant="danger">{fetchError}</Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-4 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {featuredItems.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
        <div className="text-center mt-4">
          <Link to="/products" className="btn btn-outline">View More</Link>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="features-section container py-5 mb-5 animate-on-scroll" style={{ opacity: 0 }}>
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
            <p>Your transactions are encrypted and 100% secure. (M-Pesa coming soon!)</p>
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
