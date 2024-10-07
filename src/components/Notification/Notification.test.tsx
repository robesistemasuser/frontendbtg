import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from './Notification';

// Prueba de notificaciones
test('renders success notification', () => {
  render(<Notification message="Operation successful!" type="success" />);
  expect(screen.getByText(/operation successful!/i)).toBeInTheDocument();
  expect(screen.getByText(/operation successful!/i)).toHaveClass('success');
});

test('renders error notification', () => {
  render(<Notification message="Operation failed!" type="error" />);
  expect(screen.getByText(/operation failed!/i)).toBeInTheDocument();
  expect(screen.getByText(/operation failed!/i)).toHaveClass('error');
});
