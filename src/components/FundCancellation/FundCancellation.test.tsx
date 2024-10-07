import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FundCancellation from './FundCancellation';

// Prueba de cancelación de un fondo
test('renders cancellation form and submits', async () => {
  render(<FundCancellation />);
  
  // Verifica que el título esté presente
  expect(screen.getByText(/cancel fund subscription/i)).toBeInTheDocument();
  
  // Rellena el formulario
  fireEvent.change(screen.getByPlaceholderText(/fund name/i), { target: { value: 'Test Fund' } });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
  
  // Envía el formulario
  fireEvent.click(screen.getByRole('button', { name: /cancel subscription/i }));
  
  // Verifica que el mensaje de éxito esté presente (simular alert)
});
