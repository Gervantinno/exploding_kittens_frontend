import './styles/index.scss';
import Routing from '../pages';
import Providers from './providers';
import { useEffect, useState } from 'react';
import { getUserName, setUserName } from '../shared/utils/userName';
import { getToken } from '../shared/api/auth';
import { initSocket, socket } from '../shared/api/socket';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const setupConnection = async () => {
    try {
      let token = localStorage.getItem('token');
      let username = getUserName();

      // Если нет токена, получаем имя, токен и сохраняем
      if (!token) {
        username = prompt('Введите имя')?.trim() || '';
        if (!username) {
          alert('Имя обязательно!');
          return;
        }
        setUserName(username);

        token = await getToken(username);
        localStorage.setItem('token', token);
      }

      initSocket(token);
      socket.auth.token = token;
      socket.connect();

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
    return <span>Is loading...</span>;
  }

  return (
    <Providers>
      <Routing />
    </Providers>
  );
}

export default App;
