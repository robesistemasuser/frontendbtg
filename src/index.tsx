import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Asegúrate de que este archivo también exista
import './index.css'; // Si tienes estilos globales

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
