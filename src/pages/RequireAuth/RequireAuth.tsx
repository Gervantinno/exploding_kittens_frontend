import React, { useEffect, useState } from 'react';
import { getToken } from '../../shared/utils/token';
import AuthPage from '../AuthPage/AuthPage';
import { initSocket, socket } from '../../shared/api/socket';
import { useNavigate } from 'react-router-dom';

type RequireAuthProps = {
  to?: string; // Optional: You can pass a specific redirect path
};

const RequireAuth: React.FC<React.PropsWithChildren<RequireAuthProps>> = ({ children, to }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      // Redirect to auth page if no token
      navigate('/auth');
      return;
    }

    try {
      initSocket(token);
      if (socket) {
        socket.connect(); // Explicitly connect the socket
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при инициализации сокета:', error);
      // Handle socket initialization error (e.g., redirect to an error page)
    }
  }, [navigate]);

  const token = getToken();

  if (!token) {
    return <AuthPage />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default RequireAuth;
