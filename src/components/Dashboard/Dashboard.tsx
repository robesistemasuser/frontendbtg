// Dashboard.tsx
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.styles.css';

/**
 * Componente Dashboard con un menú de navegación
 * que permite seleccionar las diferentes secciones.
 */
const Dashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alterna el estado del menú
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Cierra el menú al hacer clic en un enlace
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Admin</h2>
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776; {/* Icono de menú de hamburguesa */}
        </button>
      </header>
      <h3>Sistema para administracion de fondos</h3> {/* Mensaje de bienvenida */}
      <div className={`dashboard-container ${isMenuOpen ? 'menu-open' : ''}`}>
        <aside className={`dashboard-menu ${isMenuOpen ? 'open' : 'closed'}`}>
         <nav >
            <ul>
              <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
              <li><Link to="/fund-subscription" onClick={handleLinkClick}>Fund Subscription</Link></li>
              <li><Link to="/fund-cancellation" onClick={handleLinkClick}>Fund Cancellation</Link></li>
              <li><Link to="/transaction-history" onClick={handleLinkClick}>Transaction History</Link></li> 
            </ul>
          </nav>
        </aside>

        <main className="dashboard-content">
         
          <Outlet /> {/* Aquí se renderizan los componentes seleccionados */}
          
        </main>
        
      </div>
    </div>
  );
};

export default Dashboard;
