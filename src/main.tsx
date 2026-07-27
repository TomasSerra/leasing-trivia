import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { installKioskHardening } from './kiosk-hardening';
import './index.css';

installKioskHardening();

const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento #root');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
