import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryQuery = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortQuery = searchParams.get('sort') || '';

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/products';
        const params = [];
        if (categoryQuery) params.push(`category=${categoryQuery}`);
        if (searchQuery) params.push(`search=${searchQuery}`);
        if (sortQuery) params.push(`sort=${sortQuery}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const { data } = await api.get(url);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryQuery, searchQuery, sortQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (localSearch) {
      newParams.set('search', localSearch);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('category', e.target.value);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('sort', e.target.value);
    } else {
      newParams.delete('sort');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container py-5 products-page">
      <div className="products-header">
        <h1>All Products</h1>
        <div className="products-controls">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="products-layout">
        <aside className="products-sidebar">
          <div className="filter-group">
            <h3>Category</h3>
            <div className="filter-options">
              <label className="filter-label">
                <input 
                  type="radio" 
                  name="category" 
                  value="" 
                  checked={categoryQuery === ''}
                  onChange={handleCategoryChange}
                />
                All Categories
              </label>
              {['Electronics', 'Clothing', 'Books', 'Home', 'Sports'].map(cat => (
                <label key={cat} className="filter-label">
                  <input 
                    type="radio" 
                    name="category" 
                    value={cat} 
                    checked={categoryQuery === cat}
                    onChange={handleCategoryChange}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select 
              className="form-control" 
              value={sortQuery} 
              onChange={handleSortChange}
            >
              <option value="">Newest Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        <div className="products-main">
          {loading ? (
            <Loader />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : products.length === 0 ? (
            <div className="no-products text-center py-5">
              <h2>No products found</h2>
              <p>Try adjusting your search or filters.</p>
              <button 
                className="btn btn-outline mt-3"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
