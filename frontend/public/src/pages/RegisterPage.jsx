import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/Alert';
import './AuthPages.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, user } = useContext(AuthContext);
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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const res = await register(name, email, password);
    if (!res.success) {
      setError(res.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container py-5">
      <div className="auth-card card">
        <div className="auth-header text-center">
          <h2>Create Account</h2>
          <p>Join ShopEase today</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

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

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer mt-4 text-center">
          Already have an account?{' '}
          <Link to={redirect === '/' ? '/login' : `/login?redirect=${redirect.slice(1)}`}>
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
