import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/Alert';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const redirect = searchParams.get('redirect') ? `/${searchParams.get('redirect')}` : '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container py-5">
      <div className="auth-card card">
        <div className="auth-header text-center">
          <h2>Welcome Back</h2>
          <p>Login to your ShopEase account</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer mt-4 text-center">
          New Customer?{' '}
          <Link to={redirect === '/' ? '/register' : `/register?redirect=${redirect.slice(1)}`}>
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
