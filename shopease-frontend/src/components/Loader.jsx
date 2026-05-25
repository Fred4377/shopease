const Loader = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      <div 
        style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(30, 144, 255, 0.2)',
          borderTop: '4px solid var(--primary-blue)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      ></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
