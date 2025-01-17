import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const a = 0,
  b = 0;

createRoot(document.getElementById('root')!).render(<App />);
