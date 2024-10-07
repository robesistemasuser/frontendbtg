import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FundSubscription from './components/FundSubscription/FundSubscription';
import FundCancellation from './components/FundCancellation/FundCancellation';
import TransactionHistory from './components/TransactionHistory/TransactionHistory';
import Notification from './components/Notification/Notification';
import Dashboard from './components/Dashboard/Dashboard'; 
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.styles.css';
import Home from './components/Home/Home';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        {/* Header que estará en la parte superior */}
        <Header />

        {/* Contenido del Dashboard */}
        <main className="main-content">
          <Routes>
              <Route path="/" element={<Dashboard />}>
              <Route index element={<Home />} /> 
              <Route path="fund-subscription" element={<FundSubscription />} />
              <Route path="fund-cancellation" element={<FundCancellation />} />
              <Route path="transaction-history" element={<TransactionHistory />} />
              
            </Route>
          </Routes>
        </main>

        {/* Footer que estará en la parte inferior */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
