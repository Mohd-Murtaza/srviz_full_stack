import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: '#fff',
            color: '#10b981',
            borderBottom: '4px solid #10b981',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.1)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#fff',
            color: '#ef4444',
            borderBottom: '4px solid #ef4444',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.1)',
          },
        },
      }}
    />
  );
};

export default Toast;
