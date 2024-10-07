import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FundSubscription from './FundSubscription';

// Prueba de suscripción a un fondo
test('renders subscription form and submits', async () => {
  render(<FundSubscription />);
  
  // Verifica que el título esté presente
  expect(screen.getByText(/subscribe to a fund/i)).toBeInTheDocument();
  
  // Rellena el formulario
  fireEvent.change(screen.getByPlaceholderText(/fund name/i), { target: { value: 'New Fund' } });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
  
  // Selecciona el método de notificación
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'email' } });
  
  // Envía el formulario
  fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
  
  // Verifica que el mensaje de éxito esté presente (simular alert)
  // Para hacer esto en pruebas, necesitarías un mock de window.alert
});

