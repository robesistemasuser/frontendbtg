// Home.tsx
import React from 'react';
import './Home.styles.css';

/**
 * Componente Home que muestra un mensaje de bienvenida y una breve explicación del sistema.
 */
const Home: React.FC = () => {
  return (
    <div className="home">
      <h1>Bienvenidos al Sistema</h1>
      <p>
        Este es un sistema de gestión de fondos que permite a los usuarios suscribirse a diferentes fondos, 
        cancelar suscripciones y consultar el historial de transacciones. 
        La plataforma ofrece una experiencia fácil y eficiente para la gestión de inversiones.
      </p>
      <p>
        Navegue a través del menú para explorar las diferentes funcionalidades disponibles.
      </p>
    </div>
  );
};

export default Home;
