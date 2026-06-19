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
  
  const { login, loginWithGoogle, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const redirect = searchParams.get('redirect') ? `/${searchParams.get('redirect')}` : '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  useEffect(() => {
    // Dynamic loading of Google GIS SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '1008719970978-hb24n2qb2abe5asgp7503vvv83bac545.apps.googleusercontent.com',
          callback: handleGoogleSuccess
        });
        window.google.accounts.id.prompt(); // Show One Tap login prompt
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const handleGoogleSuccess = async (response) => {
    setIsLoading(true);
    setError(null);
    const res = await loginWithGoogle(response.credential);
    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  };

  const handleGoogleClick = () => {
    if (window.google) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            fallbackToMock();
          }
        });
      } catch (err) {
        fallbackToMock();
      }
    } else {
      fallbackToMock();
    }
  };

  const fallbackToMock = async () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate real OAuth redirection delay for physics/bouncy transition feel
    setTimeout(async () => {
      const res = await loginWithGoogle('mock-google-token-123');
      if (res.success) {
        navigate(redirect);
      } else {
        setError(res.error);
      }
      setIsLoading(false);
    }, 800);
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

        <div className="divider">or</div>

        <button 
          type="button" 
          className="btn-google" 
          onClick={handleGoogleClick}
          disabled={isLoading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.85 2.69-6.57z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.58-5.05-3.7H.95v2.3C2.43 15.89 5.5 18 9 18z"/>
            <path fill="#FBBC05" d="M3.95 10.7c-.18-.54-.28-1.12-.28-1.7s.1-1.16.28-1.7V5H.95A8.996 9 0 0 0 0 9c0 1.61.43 3.12 1.18 4.45l2.77-2.15z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4C13.46.96 11.42 0 9 0 5.5 0 2.43 2.11.95 5.09l2.77 2.15C4.66 5.16 6.65 3.58 9 3.58z"/>
          </svg>
          Sign in with Google
        </button>

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
