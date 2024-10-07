import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionHistory from './TransactionHistory';
import { getTransactionHistory } from '../../services/api';

// Mock de la función API
jest.mock('../../services/api');

test('renders transaction history', async () => {
  (getTransactionHistory as jest.Mock).mockResolvedValueOnce([
    { type: 'Subscribe', details: 'Subscribed to Fund A', date: '2024-10-01' },
    { type: 'Cancel', details: 'Cancelled subscription to Fund B', date: '2024-10-02' },
  ]);
  
  render(<TransactionHistory />);
  
  // Verifica que el título esté presente
  expect(screen.getByText(/transaction history/i)).toBeInTheDocument();
  
  // Verifica que las transacciones estén en la lista
  expect(await screen.findByText(/subscribed to fund a/i)).toBeInTheDocument();
  expect(await screen.findByText(/cancelled subscription to fund b/i)).toBeInTheDocument();
});
