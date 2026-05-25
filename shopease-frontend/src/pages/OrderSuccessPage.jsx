import { Link, useParams } from 'react-router-dom';

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div 
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: 'rgba(63, 185, 80, 0.1)',
          color: 'var(--success-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          marginBottom: '2rem'
        }}
      >
        ✓
      </div>
      
      <h1 className="mb-3">Order Placed Successfully!</h1>
      <p className="mb-4" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
        Thank you for your purchase. Your order ID is <strong className="text-primary">{id}</strong>.
      </p>
      
      <div className="flex gap-4 justify-center">
        <Link to="/profile" className="btn btn-primary">View My Orders</Link>
        <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
