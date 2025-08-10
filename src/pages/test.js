import React from 'react';

const TestHeart = () => {
  return (
    <div style={{ position: 'relative', width: '300px', height: '400px', border: '1px solid black' }}>
      <img
        src="https://via.placeholder.com/300x400"
        alt="test"
        style={{ width: '100%', height: '100%' }}
      />
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '40px',
          height: '40px',
          background: 'red',
          borderRadius: '50%',
          zIndex: 9999,
          color: 'white',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ❤️
      </div>
    </div>
  );
};

export default TestHeart;