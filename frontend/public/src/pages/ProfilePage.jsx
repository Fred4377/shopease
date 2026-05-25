import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="container py-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="card p-4">
            <h2 className="mb-4">User Profile</h2>
            <div className="mb-3">
              <label className="form-label text-secondary">Name</label>
              <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user?.name}</div>
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary">Email Address</label>
              <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user?.email}</div>
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary">Account Status</label>
              <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                {user?.isAdmin ? (
                  <span className="text-primary">Administrator</span>
                ) : (
                  <span className="text-success">Customer</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3" style={{ gridColumn: 'span 3' }}>
          <div className="card p-4">
            <h2 className="mb-4">My Orders</h2>
            
            {loading ? (
              <Loader />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : orders.length === 0 ? (
              <Alert variant="info">You have no orders yet.</Alert>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th className="py-2">ID</th>
                      <th className="py-2">DATE</th>
                      <th className="py-2">TOTAL</th>
                      <th className="py-2">PAID</th>
                      <th className="py-2">DELIVERED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td className="py-3" style={{ fontSize: '0.9rem' }}>{order._id}</td>
                        <td className="py-3">{order.createdAt.substring(0, 10)}</td>
                        <td className="py-3">${order.totalPrice.toFixed(2)}</td>
                        <td className="py-3">
                          {order.isPaid ? (
                            <span className="text-success">Yes</span>
                          ) : (
                            <span className="text-danger">No</span>
                          )}
                        </td>
                        <td className="py-3">
                          {order.isDelivered ? (
                            <span className="text-success">Yes</span>
                          ) : (
                            <span className="text-danger">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
