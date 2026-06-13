import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          ShopEase
        </Link>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <div className="search-bar">
            <input type="text" placeholder="Search products..." className="form-control" />
            <button className="btn btn-primary">Search</button>
          </div>

          <nav className="nav-menu">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
            
            <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMenuOpen(false)}>
              Cart
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            {user ? (
              <div className="user-dropdown">
                <button 
                  className="user-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <span>{user.name}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>My Orders</Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Admin Dashboard</Link>
                    )}
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
