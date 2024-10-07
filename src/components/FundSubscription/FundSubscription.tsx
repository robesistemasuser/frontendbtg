import React, { useEffect, useState } from 'react';
import { subscribeToFund, fetchUserByDocument, fetchFunds, registrarTransactionHistory } from '../../services/api';
import './FundSubscription.styles.css';
import { Toaster, toast } from 'sonner';

interface User {
  id: string;
  name: string;
  documento: string;
}

const FundSubscription: React.FC = () => {
  const [formData, setFormData,] = useState({
    document: '',
    fundId: '',
    fundName: '', // Nuevo campo para almacenar el nombre del fondo
    amount: 0,
    notifyBy: 'email'
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [funds, setFunds] = useState<{ id: string; name: string }[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [isUserValid, setIsUserValid] = useState<boolean>(false);
  const [filterText, setFilterText] = useState('');
  const [start, setStart] = useState(0);
  const [limit] = useState(5); // Mostrar siempre 5 usuarios

  // Función centralizada para manejar errores
  const handleError = (error: any) => {
    const backendErrorMessage = error?.response?.data?.message;

    if (backendErrorMessage) {
      return backendErrorMessage; // Mensaje del backend
    }

    if (error?.message) {
      return error.message; // Error de red o JavaScript
    }

    return 'An unexpected error occurred. Please try again later.'; // Fallback
  };

  // Cargar fondos al montar el componente
  useEffect(() => {
    const loadFunds = async () => {
      try {
        const fundsList = await fetchFunds();
        setFunds(fundsList);
      } catch (error) {
        toast.error('Error fetching funds. Please try again later.');
      }
    };

    loadFunds();
  }, []);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersList = await fetchUserByDocument();
        setUsers(usersList);
        setDisplayedUsers(usersList.slice(start, start + limit));
      } catch (error) {
        toast.error('Error fetching users. Please try again later.');
      }
    };

    loadUsers();
  }, [start, limit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'document') {
      setFilterText(value);
      handleFilterUsers(value);
    }
  };

  const handleFilterUsers = (filter: string) => {
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
    setDisplayedUsers(filteredUsers.slice(start, start + limit));
  };

  const handleUserSelect = (user: User) => {
    setFormData({ ...formData, document: user.documento });
    setUserId(user.id);
    setIsUserValid(true);
  };

  const loadMoreUsers = () => {
    setStart(prevStart => prevStart + limit);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error('Please validate the user document first.', { icon: '⚠️' });
      return;
    }

    const subscriptionData = {
      userId,
      fundId: formData.fundId,
      fundName: formData.fundName, // Incluimos el nombre del fondo en la solicitud
      document: formData.document,
      transactionType: 'subscribe',
      amount: Number(formData.amount),
      active: true,
    };
     

    try {
      const response = await subscribeToFund(subscriptionData);
      
      const successMessage = typeof response === 'object' && 'message' in response
        ? response.message
        : 'Subscription successful!';

      toast.success(successMessage, { duration: 4000, icon: '✅' });

      resetForm();
      
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = handleError(error);
      toast.error(errorMessage, {
        duration: 5000,
        icon: '❌',
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      document: '',
      fundId: '',
      fundName: '', // Restablecemos el nombre del fondo también
      amount: 0,
      notifyBy: 'email'
    });
    setUserId(null);
    setIsUserValid(false);
    setFilterText('');
    setDisplayedUsers(users.slice(start, start + limit));
    setStart(0);
  };

  const isFormValid = () => {
    return formData.fundId !== '' && formData.amount > 0 && isUserValid;
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="fund-subscription-form">
        <h2>Subscribe to a Fund</h2>

        <select
          name="userId"
          value={userId || ''}
          onChange={(e) => {
            const selectedUser = users.find(user => user.id === e.target.value);
            if (selectedUser) {
              handleUserSelect(selectedUser);
            } else {
              setUserId(null);
              setFormData({ ...formData, document: '' });
              setIsUserValid(false);
            }
          }}
          required
        >
          <option value="">Select a User</option>
          {displayedUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name || 'Nombre no disponible'}
            </option>
          ))}
          {filterText && displayedUsers.length === 0 && <option disabled>No users found</option>}
        </select>

        <select
          name="fundId"
          value={formData.fundId}
          onChange={(e) => {
            const selectedFund = funds.find(fund => fund.id === e.target.value);
            if (selectedFund) {
              setFormData({ ...formData, fundId: selectedFund.id, fundName: selectedFund.name }); // Guardamos el id y nombre del fondo
            }
          }}
          disabled={!isUserValid}
          required
        >
          <option value="">Select a Fund</option>
          {funds.map(fund => (
            <option key={fund.id} value={fund.id}>
              {fund.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="amount"
          value={formData.amount}
          placeholder="Amount"
          onChange={handleChange}
          disabled={!isUserValid}
          required
        />

        <select
          name="notifyBy"
          value={formData.notifyBy}
          onChange={handleChange}
          disabled={!isUserValid}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>

        <button
          type="submit"
          className={`subscribe-button ${!isFormValid() ? 'inactive' : ''}`}
          disabled={!isFormValid()}
        >
          Subscribe
        </button>
      </form>

      <Toaster position="top-center" />
    </div>
  );
};

export default FundSubscription;
