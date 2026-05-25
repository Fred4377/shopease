import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
        ]);

        const productsCount = productsRes.data.length;
        const ordersCount = ordersRes.data.length;
        const totalRevenue = ordersRes.data.reduce((acc, order) => acc + order.totalPrice, 0);
        
        // Mocking user count for now, since we didn't build a users endpoint
        const usersCount = 5;

        setStats({
          products: productsCount,
          orders: ordersCount,
          revenue: totalRevenue,
          users: usersCount,
        });

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Admin Dashboard</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-5">
            <div className="card p-4 text-center">
              <h3 className="text-secondary mb-2" style={{fontSize: '1.1rem'}}>Total Revenue</h3>
              <div style={{fontSize: '2rem', fontWeight: '700', color: 'var(--success-green)'}}>
                ${stats.revenue.toFixed(2)}
              </div>
            </div>
            
            <div className="card p-4 text-center">
              <h3 className="text-secondary mb-2" style={{fontSize: '1.1rem'}}>Total Orders</h3>
              <div style={{fontSize: '2rem', fontWeight: '700', color: 'var(--primary-blue)'}}>
                {stats.orders}
              </div>
            </div>
            
            <div className="card p-4 text-center">
              <h3 className="text-secondary mb-2" style={{fontSize: '1.1rem'}}>Total Products</h3>
              <div style={{fontSize: '2rem', fontWeight: '700', color: '#f59e0b'}}>
                {stats.products}
              </div>
            </div>
            
            <div className="card p-4 text-center">
              <h3 className="text-secondary mb-2" style={{fontSize: '1.1rem'}}>Total Users</h3>
              <div style={{fontSize: '2rem', fontWeight: '700', color: '#8b5cf6'}}>
                {stats.users}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-4">
              <h2 className="mb-4">Quick Links</h2>
              <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                <Link to="/admin/products" className="btn btn-outline btn-block text-center" style={{ padding: '1rem' }}>
                  Manage Products
                </Link>
                <Link to="/admin/orders" className="btn btn-outline btn-block text-center" style={{ padding: '1rem' }}>
                  Manage Orders
                </Link>
              </div>
            </div>
            
            <div className="card p-4">
              <h2 className="mb-4">System Status</h2>
              <ul style={{ paddingLeft: '1rem' }}>
                <li className="mb-2">API Server: <span className="text-success">Online</span></li>
                <li className="mb-2">Database: <span className="text-success">Connected</span></li>
                <li className="mb-2">Environment: <span className="text-primary">Development</span></li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
