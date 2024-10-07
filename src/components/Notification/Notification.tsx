import React from 'react';
import './Notification.styles.css';

/**
 * Componente para mostrar notificaciones.
 * Se puede utilizar para mostrar mensajes de éxito o error.
 */
interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

export default Notification;
