import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const deliverHandler = async (id) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await api.put(`/orders/${id}/deliver`);
        fetchOrders();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Orders</h1>

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
                  <th className="p-3">USER</th>
                  <th className="p-3">DATE</th>
                  <th className="p-3">TOTAL</th>
                  <th className="p-3">PAID</th>
                  <th className="p-3">DELIVERED</th>
                  <th className="p-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-3" style={{ fontSize: '0.85rem' }}>{order._id}</td>
                    <td className="p-3">{order.user && order.user.name}</td>
                    <td className="p-3">{order.createdAt.substring(0, 10)}</td>
                    <td className="p-3">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-3">
                      {order.isPaid ? (
                        <span className="text-success">Yes</span>
                      ) : (
                        <span className="text-danger">No</span>
                      )}
                    </td>
                    <td className="p-3">
                      {order.isDelivered ? (
                        <span className="text-success">Yes</span>
                      ) : (
                        <span className="text-danger">No</span>
                      )}
                    </td>
                    <td className="p-3">
                      {!order.isDelivered && (
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                          onClick={() => deliverHandler(order._id)}
                        >
                          Mark Delivered
                        </button>
                      )}
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

export default AdminOrders;
