
import React, { useState, useEffect } from 'react';
import type { Order } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useClients } from '../hooks/useClients';

interface OrderFormProps {
  onAddOrder: (order: Omit<Order, 'id'>) => void;
}

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const OrderForm: React.FC<OrderFormProps> = ({ onAddOrder }) => {
  const { clients, addClient, loading: loadingClients } = useClients();
  const [clientName, setClientName] = useState('');
  const [hamburgerBuns, setHamburgerBuns] = useState(0);
  const [mediumHamburgerBuns, setMediumHamburgerBuns] = useState(0); // Novo estado
  const [bisnagaBuns, setBisnagaBuns] = useState(0);
  const [baguettes, setBaguettes] = useState(0);
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [successMessage, setSuccessMessage] = useState('');

  // Estados para o Modal de Novo Cliente
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('Por favor, selecione um cliente.');
      return;
    }
    
    onAddOrder({
      clientName,
      hamburgerBuns: Number(hamburgerBuns) || 0,
      mediumHamburgerBuns: Number(mediumHamburgerBuns) || 0, // Enviando novo campo
      bisnagaBuns: Number(bisnagaBuns) || 0,
      baguettes: Number(baguettes) || 0,
      requestDate,
    });

    // Reset form (mas mantém a data atual)
    setClientName('');
    setHamburgerBuns(0);
    setMediumHamburgerBuns(0);
    setBisnagaBuns(0);
    setBaguettes(0);
    // setRequestDate(new Date().toISOString().split('T')[0]); // Opcional: manter a data ou resetar

    // Show success message
    setSuccessMessage('Pedido registrado com sucesso! Redirecionando para o dashboard...');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    setIsAddingClient(true);
    const newClient = await addClient(newClientName.trim());
    setIsAddingClient(false);

    if (newClient) {
      setClientName(newClient.name); // Seleciona automaticamente o novo cliente
      setNewClientName('');
      setIsClientModalOpen(false);
    }
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
            
            {/* Seleção de Cliente com Botão de Adicionar */}
            <div>
              <label htmlFor="clientSelect" className="block text-sm font-medium text-brand-primary mb-1">
                Nome do Cliente
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <select
                    id="clientSelect"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="block w-full px-4 py-2 bg-white/50 border border-brand-primary/30 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm transition-colors appearance-none text-gray-700"
                  >
                    <option value="" disabled>Selecione um cliente...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.name}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(true)}
                  className="bg-brand-secondary hover:bg-yellow-500 text-brand-dark font-bold p-2 rounded-md shadow-sm transition-colors flex items-center justify-center"
                  title="Adicionar Novo Cliente"
                >
                  <PlusIcon />
                </button>
              </div>
              {clients.length === 0 && !loadingClients && (
                <p className="text-xs text-amber-600 mt-1">Nenhum cliente cadastrado. Clique no + para adicionar.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="hamburgerBuns"
                label="Pães de Hambúrguer"
                type="number"
                value={hamburgerBuns.toString()}
                onChange={(e) => setHamburgerBuns(parseInt(e.target.value, 10) || 0)}
                min="0"
              />
              <Input
                id="mediumHamburgerBuns"
                label="Pães de Hambúrguer Médio"
                type="number"
                value={mediumHamburgerBuns.toString()}
                onChange={(e) => setMediumHamburgerBuns(parseInt(e.target.value, 10) || 0)}
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

      {/* Modal de Novo Cliente */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-brand-primary px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Adicionar Novo Cliente</h3>
              <button 
                onClick={() => setIsClientModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveNewClient} className="p-6 space-y-4">
              <Input
                id="newClientName"
                label="Nome Completo do Cliente"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Ex: Padaria do João"
                autoFocus
                required
              />
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <Button type="submit" className="py-2 px-6 text-sm" disabled={isAddingClient}>
                  {isAddingClient ? 'Salvando...' : 'Salvar Cliente'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
