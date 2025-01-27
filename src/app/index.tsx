import './styles/index.scss';
import Routing from '../pages';
import Providers from './providers';

function App() {
  return (
    <Providers>
      <Routing />
    </Providers>
  );
}

export default App;
