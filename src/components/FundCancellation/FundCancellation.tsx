import React, { useState } from 'react';
import { getUserByDocument, getUserFunds, cancelFundSubscription } from '../../services/api'; 
import './FundCancellation.styles.css';

/**
 * Define la estructura del tipo de relación de fondos.
 */
interface Fund {
  fundId: string;
  document: string;
  fundName: string; 
}

const FundCancellation: React.FC = () => {
  const [userId, setUserId] = useState<string>(''); // Para almacenar el userId después de la búsqueda
  const [document, setDocument] = useState<string>(''); // Para almacenar el número de documento ingresado
  const [funds, setFunds] = useState<Fund[]>([]); // Fondos asociados al usuario
  const [errorMessage, setErrorMessage] = useState<string>(''); // Mensaje de error si no se encuentra el usuario

  // Función para buscar el usuario por el número de documento
  const handleSearchUser = async () => {
    try {
      setFunds([]); // Limpiar fondos antes de nueva búsqueda
      const users = await getUserByDocument(document); // users es un array
      setUserId(users.id);
      setErrorMessage(''); // Limpiar mensaje de error

      // Obtener los fondos asociados al usuario
      const userFunds = await getUserFunds(users.id);
      
      if (userFunds.length === 0) {
        setErrorMessage('Usuario no existe o no tiene transacciones asociadas.');
        setFunds([]); // Limpiar transacciones si no hay datos
      } else {
        // Transformar los datos a la estructura correcta
        const transformedFunds: Fund[] = await Promise.all(
          userFunds.map(async (fund) => {
            // Extraer el documento y el ID del fondo del campo details
            const detailsArray = fund.details.split(', ');
            const document = detailsArray[0]?.split(': ')[1] || 'N/A';
            const fundId = detailsArray[1]?.split(': ')[1] || 'N/A';
            const fundName = detailsArray[2]?.split(': ')[1] || 'N/A';
           
           return {
              document,
              fundId,
              fundName,
            };
          })
        );
        

setFunds(transformedFunds);
setErrorMessage(''); // Limpiar mensajes de error


        setFunds(transformedFunds);
        setErrorMessage(''); // Limpiar mensajes de error
      }
    } catch (error) {
      console.error('Error buscando usuario', error);
      setErrorMessage('Error al buscar el usuario.');
    }
  };

  // Función para cancelar una suscripción a un fondo
  const handleCancelSubscription = async (fundId: string) => {
    try {
      await cancelFundSubscription(userId, fundId);
      alert('Cancelación exitosa!');

      // Actualizar la lista de fondos tras la cancelación
      const updatedFunds = funds.filter((fund) => fund.fundId !== fundId);
      setFunds(updatedFunds);
    } catch (error) {
      console.error('Error al cancelar la suscripción', error);
      alert('Error al cancelar la suscripción. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="fund-cancellation-container">
      <h2>Cancelar Suscripción a Fondos</h2>

      {/* Formulario para buscar el usuario por documento */}
      <div className="search-user-form">
        <input
          type="text"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          placeholder="Número de documento"
        />
        <button onClick={handleSearchUser}>Buscar Usuario</button>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Si el usuario es encontrado, mostrar los fondos */}
      {userId && funds.length > 0 && (
        <table className="fund-list-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Fondo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <tr key={fund.fundId}>
                <td>{fund.document}</td> 
                <td>{fund.fundName}</td> 
                <td>
                  <button onClick={() => handleCancelSubscription(fund.fundId)}>
                    Cancelar Suscripción
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Mensaje si no hay fondos asociados */}
      {userId && funds.length === 0 && <p>No hay fondos asociados a este usuario.</p>}
    </div>
  );
};

export default FundCancellation;
