const Alert = ({ variant = 'danger', children }) => {
  const styles = {
    danger: {
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      color: '#ff6b6b',
      border: '1px solid rgba(231, 76, 60, 0.3)',
    },
    success: {
      backgroundColor: 'rgba(63, 185, 80, 0.1)',
      color: '#3FB950',
      border: '1px solid rgba(63, 185, 80, 0.3)',
    },
    info: {
      backgroundColor: 'rgba(30, 144, 255, 0.1)',
      color: '#1E90FF',
      border: '1px solid rgba(30, 144, 255, 0.3)',
    }
  };

  return (
    <div 
      style={{
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '1rem',
        ...styles[variant]
      }}
    >
      {children}
    </div>
  );
};

export default Alert;
