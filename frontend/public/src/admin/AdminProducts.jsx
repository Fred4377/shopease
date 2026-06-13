import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new sample product?')) {
      try {
        await api.post('/products', {});
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="flex justify-between items-center mb-4">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={createProductHandler}>
          + Add New Product
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--dark-bg)' }}>
                  <th className="p-3">ID</th>
                  <th className="p-3">NAME</th>
                  <th className="p-3">PRICE</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3">STOCK</th>
                  <th className="p-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-3" style={{ fontSize: '0.85rem' }}>{product._id}</td>
                    <td className="p-3" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </td>
                    <td className="p-3">${product.price.toFixed(2)}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {/* Mock Edit for now */}
                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Edit</button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                          onClick={() => deleteHandler(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
