import axios from 'axios';

// URL base de la API desde variables de entorno
const BASE_URL = process.env.REACT_APP_API_URL; 

/**
 * Suscribirse a un fondo.
 * @param subscriptionData - Datos de la suscripción.
 * @returns Un objeto con el mensaje de éxito o error.
 */
export const subscribeToFund = async (subscriptionData: {
    userId: string;
    fundId: string;
    fundName: string;
    document: string;
    transactionType: string;
    amount: number;
    active: boolean;
}): Promise<{ message: string }> => {
    try { 
        const response = await axios.post(`${BASE_URL}/userFunds`, subscriptionData);
        
        return { message: response.data.message || 'Subscription successful!' };
    } catch (error: any) { 
        throw new Error(error.response?.data?.message || 'Error al suscribirse al fondo.');
    } 
};

/**
 * Cancelar la suscripción a un fondo.
 * @param fundId - ID del fondo cuya suscripción se desea cancelar.
 * @returns Un objeto con el mensaje de éxito o error.
 */
export const cancelFundSubscription = async (fundId: string, userId: string): Promise<{ message: string }> => {
    try {
        const response = await axios.delete(`${BASE_URL}/userfunds/${userId}/${fundId}`);
        return { message: response.data.message || 'Subscription cancelled successfully!' };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al cancelar la suscripción al fondo.');
    }
};  

/**
 * Obtener el historial de transacciones.
 * @param documento - ID del usuario a consultar transacciones.
 * @returns Un array de objetos que representan el historial de transacciones.
 */
export const getTransactionHistory = async (documento: string): Promise<{
    type: string;
    details: string;
    date: string;
  }[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/transactions/document/${documento}`);

      // Mapeamos la respuesta para estructurar los datos en un formato más amigable
      return response.data.map((transaction: any) => ({
        type: transaction.transactionType?.S || 'N/A', // Tipo de transacción (subscribe, etc.)
        details: `Documento: ${transaction.documento?.S || 'N/A'}, Fondo: ${transaction.fundName?.S || 'N/A'}, FundId: ${transaction.fundId?.S || 'N/A'}, Monto: ${transaction.amount?.N || '0'}`,
        date: new Date(transaction.transactionDate?.S || '').toLocaleString(), // Formatear la fecha
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener el historial de transacciones.');
    }
  };

/**
 * Obtener los fondos dinscritos del usuario.
 * @param documento - ID del usuario a consultar fondos inscritos del usuario.
 * @returns Un array de objetos que representan los fondos inscritos del usuario.
 */
export const getUserByDocument = async (documento: string): Promise<{
    id: any;
    documento: any; 
  }> => {
      try { 
          const response = await axios.get(`${BASE_URL}/users/documento/${documento}`) 
        
          return response.data 
      } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Error al obtener los fondos inscritos.');
      }
  };

/**
 * Enviar una notificación.
 * @param message - Mensaje de notificación a enviar.
 * @returns Un objeto con el mensaje de éxito o error.
 */
export const sendNotification = async (message: string, notifyBy: string): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`${BASE_URL}/notifications`, { message, notifyBy });
        return { message: response.data.message || 'Notification sent successfully!' };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al enviar la notificación.');
    }
};

/**
 * Obtener la lista de fondos disponibles.
 * @returns Un array de objetos que representan los fondos disponibles.
 */
export const fetchFunds = async (): Promise<{ id: string; name: string }[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/funds`);
        return response.data; // Asegúrate de que la estructura de la respuesta es [{ id: string, name: string }, ...]
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener la lista de fondos.');
    }
};

/**
 * Obtener la lista de fondos disponibles.
 * @returns Un array de objetos que representan los fondos disponibles.
 */
export const getFundsById = async (fundId: string): Promise<{ id: string; name: string,  details: string; }> => {
    try { 
        const response = await axios.get(`${BASE_URL}/funds/${fundId}`);
        
        return {
            id: response.data.id.S,
            name: response.data.name.S,
            details: `Name: ${response.data.name.S}`,  
        };
        
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener el fondos.');
    }
};


/**
 * Obtener la lista de fondos disponibles.
 * @returns Un array de objetos que representan los fondos disponibles.
 */
export const getUserFunds = async (userId: string): Promise<{ funId: string; document: string, fundName: string,  details: string; }[]> => {
    try { 
        const response = await axios.get(`${BASE_URL}/userfunds/${userId}`);
        return response.data.map((fund: any) => ({
            
            details: `Documento: ${fund.document.S}, Fondo: ${fund.fundId.S}, Nombre: ${fund.fundName.S}`
           
            
        }));
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener la lista de fondos.');
    }
};

/**
 * Buscar un usuario por documento.
 * @param document - Documento del usuario a buscar.
 * @returns Un objeto con la información del usuario.
 */
export const fetchUserByDocument = async (): Promise<{id: string; name: string; documento: string }[]> => {
    try {  
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data; // Asegúrate de que la respuesta tiene un campo 'id'
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al buscar el usuario.');
    }
};

/**
 * Registrar historico de la transaction de un fondo.
 * @param transactionData - Datos de la transaction.
 * @returns Un objeto con el mensaje de éxito o error.
 */
export const registrarTransactionHistory = async (transactionData: {
    userId: string;
    fundId: string;
    documento: string;
    fundName: string;
    transactionType: string;
    amount: number;  
}): Promise<{ message: string }> => {
    try { 
        const response = await axios.post(`${BASE_URL}/transactions`, transactionData);
       
        return { message: response.data.message || 'Subscription successful!' };
    } catch (error: any) { 
        throw new Error(error.response?.data?.message || 'Error al suscribirse al fondo.');
    } 
};