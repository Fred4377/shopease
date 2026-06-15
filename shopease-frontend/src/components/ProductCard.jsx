import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

// Category-based fallback images from Unsplash (free, no auth needed)
const FALLBACK_IMAGES = {
  Electronics: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  Clothing:    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80',
  Books:       'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
  Home:        'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&auto=format&fit=crop&q=80',
  Sports:      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
  default:     'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
};

const getImageSrc = (product) => {
  if (product.image && product.image.startsWith('http')) return product.image;
  return FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.default;
};

const handleImgError = (e, category) => {
  e.target.onerror = null; // prevent infinite loop
  e.target.src = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
};

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <div className="card product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-img-container">
          <img src={getImageSrc(product)} alt={product.name} className="product-img" onError={e => handleImgError(e, product.category)} />
        </div>
      </Link>
      
      <div className="product-info">
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        
        <div className="product-rating">
          <span className="stars">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </span>
          <span className="reviews-count">({product.numReviews} reviews)</span>
        </div>
        
        <div className="product-price-row">
          <div className="product-price">KSh {product.price.toLocaleString()}</div>
        </div>

        <div className="product-actions">
          <Link to={`/product/${product._id}`} className="btn btn-outline btn-block">
            View Details
          </Link>
          <button 
            className="btn btn-primary btn-block mt-1"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
