
import React, { useState } from 'react';
import type { Order } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface OrderFormProps {
  onAddOrder: (order: Omit<Order, 'id'>) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onAddOrder }) => {
  const [clientName, setClientName] = useState('');
  const [hamburgerBuns, setHamburgerBuns] = useState(0);
  const [bisnagaBuns, setBisnagaBuns] = useState(0);
  const [baguettes, setBaguettes] = useState(0);
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('Por favor, insira o nome do cliente.');
      return;
    }
    
    onAddOrder({
      clientName,
      hamburgerBuns: Number(hamburgerBuns) || 0,
      bisnagaBuns: Number(bisnagaBuns) || 0,
      baguettes: Number(baguettes) || 0,
      requestDate,
    });

    // Reset form
    setClientName('');
    setHamburgerBuns(0);
    setBisnagaBuns(0);
    setBaguettes(0);
    setRequestDate(new Date().toISOString().split('T')[0]);

    // Show success message
    setSuccessMessage('Pedido registrado com sucesso! Redirecionando para o dashboard...');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-brand-dark mb-4">Registrar Novo Pedido</h2>
          <p className="text-brand-primary mb-6 text-sm sm:text-base">Preencha as informações abaixo para adicionar um novo pedido.</p>
          
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
              <p>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="clientName"
              label="Nome do Cliente"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                id="hamburgerBuns"
                label="Pães de Hambúrguer"
                type="number"
                value={hamburgerBuns.toString()}
                onChange={(e) => setHamburgerBuns(parseInt(e.target.value, 10) || 0)}
                min="0"
              />
              <Input
                id="bisnagaBuns"
                label="Pães de Bisnaga"
                type="number"
                value={bisnagaBuns.toString()}
                onChange={(e) => setBisnagaBuns(parseInt(e.target.value, 10) || 0)}
                min="0"
              />
              <Input
                id="baguettes"
                label="Baguetes"
                type="number"
                value={baguettes.toString()}
                onChange={(e) => setBaguettes(parseInt(e.target.value, 10) || 0)}
                min="0"
              />
            </div>
            <Input
              id="requestDate"
              label="Data da Requisição"
              type="date"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              required
            />
            <div className="pt-2">
              <Button type="submit" className="w-full">
                Registrar Pedido
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
