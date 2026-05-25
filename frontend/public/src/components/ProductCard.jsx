import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

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
          <img src={product.image} alt={product.name} className="product-img" />
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
          <div className="product-price">${product.price.toFixed(2)}</div>
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
