import React, { useEffect, useState } from 'react';
import { getTransactionHistory } from '../../services/api';
import './TransactionHistory.styles.css';

/**
 * Define la estructura del tipo de las transacciones.
 */
interface Transaction {
  documento: string;
  fundName: string;
  amount: number;
  transactionType: string;
  transactionDate: string;
}

/**
 * Componente para mostrar el historial de transacciones.
 * Muestra las transacciones recientes de apertura y cancelación.
 */
const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string>(''); // Para almacenar el número de documento
  const [errorMessage, setErrorMessage] = useState<string>(''); // Para mostrar mensajes de error
  const [currentPage, setCurrentPage] = useState<number>(1); // Página actual
  const itemsPerPage = 10; // Elementos por página

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null); // Configuración de ordenación

  const handleFetchTransactions = async () => {
    try {
      setTransactions([]); // Limpiar transacciones antes de obtener nuevas
      const data = await getTransactionHistory(userId);
    
      if (data.length === 0) {
        setErrorMessage('Usuario no existe o no tiene transacciones asociadas.');
        setTransactions([]); // Limpiar transacciones si no hay datos
      } else {
        // Transformar los datos a la estructura correcta
        const transformedData: Transaction[] = data.map((transaction) => {
          // Extraer el documento y el monto del campo details
          const detailsArray = transaction.details.split(', ');
          const documento = detailsArray[0]?.split(': ')[1] || 'N/A'; 
          const fundName = detailsArray[1]?.split(': ')[1] || 'N/A';  
          const amount = parseFloat(detailsArray[3]?.split(': ')[1] || '0');  
           
          return {
            documento,
            amount,
            fundName,
            transactionType: transaction.type || 'N/A', // Usar el tipo directamente
            transactionDate: transaction.date || 'N/A', // Usar la fecha directamente
          };
        });

        setTransactions(transformedData);
        setErrorMessage(''); // Limpiar mensajes de error
      }
    } catch (error) {
      setErrorMessage('Error al obtener el historial de transacciones.');
      console.error('Error fetching transaction history', error);
    }
  };

  // Función para manejar el ordenamiento
  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Efecto para aplicar la ordenación
  useEffect(() => {
    let sortedTransactions = [...transactions];
    if (sortConfig !== null) {
      sortedTransactions.sort((a, b) => {
        if (a[sortConfig.key as keyof Transaction] < b[sortConfig.key as keyof Transaction]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof Transaction] > b[sortConfig.key as keyof Transaction]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setTransactions(sortedTransactions);
  }, [sortConfig]);

  // Lógica de paginación
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  return (
    <div className="transaction-history">
      <h2>Historial de Transacciones</h2>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Número de documento"
      />
      <button onClick={handleFetchTransactions}>Buscar</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <table>
        <thead>
          <tr>
            <th>#</th> {/* Nueva columna de enumeración */}
            <th onClick={() => handleSort('documento')}>Documento</th>
            <th onClick={() => handleSort('fondo')}>Fondo</th>
            <th onClick={() => handleSort('amount')}>Monto</th>
            <th onClick={() => handleSort('transactionType')}>Tipo de Transacción</th>
            <th onClick={() => handleSort('transactionDate')}>Fecha de Transacción</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.length > 0 ? (
            currentTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{indexOfFirstTransaction + index + 1}</td> {/* Enumeración */}
                <td>{transaction.documento}</td>
                <td>{transaction.fundName}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.transactionType}</td>
                <td>{transaction.transactionDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No hay transacciones disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className="page-button"
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
