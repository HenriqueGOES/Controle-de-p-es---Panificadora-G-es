
import React, { useState } from 'react';
import { OrderForm } from './components/OrderForm';
import { Dashboard } from './components/Dashboard';
import { Financial } from './components/Financial';
import { Header } from './components/Header';
import { useOrders } from './hooks/useOrders';
import type { View } from './types';
import { Order } from './types';

const App: React.FC = () => {
  const { orders, addOrder } = useOrders();
  const [currentView, setCurrentView] = useState<View>('form');

  const handleAddOrder = (order: Omit<Order, 'id'>) => {
    addOrder(order);
    setCurrentView('dashboard'); // Switch to dashboard after adding an order
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {currentView === 'form' && (
          <OrderForm onAddOrder={handleAddOrder} />
        )}
        {currentView === 'dashboard' && (
          <Dashboard orders={orders} />
        )}
        {currentView === 'financial' && (
          <Financial orders={orders} />
        )}
      </main>
      <footer className="text-center p-4 mt-8 text-brand-primary/70">
        <p>&copy; {new Date().getFullYear()} Panificadora Góes. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
