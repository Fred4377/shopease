import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  if (loading) return <div className="container py-5"><Loader /></div>;
  if (error) return <div className="container py-5"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="container py-5">
      <div className="product-detail-layout">
        <div className="product-detail-img">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          
          <div className="product-rating mb-3">
            <span className="stars">
              {'★'.repeat(Math.floor(product.rating || 0))}
              {'☆'.repeat(5 - Math.floor(product.rating || 0))}
            </span>
            <span className="reviews-count">({product.numReviews} reviews)</span>
          </div>
          
          <div className="product-price-large mb-3">
            ${product.price?.toFixed(2)}
          </div>
          
          <div className={`stock-status mb-3 ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </div>
          
          <p className="product-description mb-4">
            {product.description}
          </p>
          
          {product.stock > 0 && (
            <div className="qty-selector mb-4">
              <span className="qty-label">Quantity:</span>
              <div className="qty-controls">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                >-</button>
                <input type="number" value={qty} readOnly />
                <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={qty >= product.stock}
                >+</button>
              </div>
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              className="btn btn-success btn-block mb-2"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button 
              className="btn btn-primary btn-block"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
