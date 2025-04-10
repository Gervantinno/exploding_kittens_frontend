import './styles/index.scss';
import Routing from '../pages';
import Providers from './providers';
import { useEffect, useState } from 'react';
import { initSocket, socket } from '../shared/api/socket';
import { getToken } from '../shared/utils/token';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const setupConnection = async () => {
    try {
      const token = getToken();

      if (token) {
        initSocket(token);

        if (!socket) return;

        if ('token' in socket.auth) {
          socket.auth.token = token;
        }

        socket.connect();
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при инициализации:', error);
      alert('Что-то пошло не так. Попробуйте позже.');
    }
  };

  useEffect(() => {
    setupConnection();
  }, []);

  if (isLoading) {
    return <span>Загрузка ...</span>;
  }

  return (
    <Providers>
      <Routing />
    </Providers>
  );
}

export default App;
