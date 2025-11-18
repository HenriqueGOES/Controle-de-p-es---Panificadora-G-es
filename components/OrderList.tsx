
import React, { useState, useMemo, useEffect } from 'react';
import type { Order } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface OrderListProps {
  orders: Order[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updatedOrder: Partial<Order>) => void;
}

type SortKey = 'clientName' | 'requestDate';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const OrderList: React.FC<OrderListProps> = ({ orders, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({
    key: 'requestDate',
    direction: 'descending',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // State for Edit Modal
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sortedAndFilteredOrders = useMemo(() => {
    let filteredOrders = orders.filter(order =>
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filteredOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredOrders;
  }, [orders, searchTerm, sortConfig]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);

  const totalPages = Math.ceil(sortedAndFilteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = sortedAndFilteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };
  
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Data inválida';
      const date = new Date(dateString + 'T00:00:00');
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return new Intl.DateTimeFormat('pt-BR').format(date);
    } catch (error) {
      return 'Data inválida';
    }
  }

  const handleEditClick = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setEditingOrder(order);
    setShowDeleteConfirm(false); // Garante que começa sem a confirmação de exclusão
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder && onUpdate) {
      onUpdate(editingOrder.id, {
        clientName: editingOrder.clientName,
        hamburgerBuns: editingOrder.hamburgerBuns,
        bisnagaBuns: editingOrder.bisnagaBuns,
        baguettes: editingOrder.baguettes,
        requestDate: editingOrder.requestDate
      });
      setEditingOrder(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = () => {
    if (editingOrder && onDelete) {
        onDelete(editingOrder.id);
        setEditingOrder(null);
        setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold font-serif text-brand-dark mb-4">Histórico de Pedidos</h3>
          <div className="mb-4">
             <Input
                id="search-client"
                label="Buscar por Cliente"
                type="text"
                placeholder="Digite o nome do cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          {/* Container principal da lista */}
          <div className="w-full">
            
            {/* === MODO DESKTOP (Tabela) - Visível apenas em md ou maior === */}
            <div className="hidden md:block border rounded-lg border-brand-primary/20 bg-white overflow-hidden">
              <div className="grid grid-cols-12 gap-4 bg-brand-light border-b border-brand-primary/20 py-3 px-4 text-xs font-medium text-brand-primary uppercase tracking-wider">
                <div 
                  className="col-span-4 cursor-pointer flex items-center hover:text-brand-dark"
                  onClick={() => requestSort('clientName')}
                >
                  Cliente{getSortIndicator('clientName')}
                </div>
                <div 
                  className="col-span-2 cursor-pointer flex items-center hover:text-brand-dark"
                  onClick={() => requestSort('requestDate')}
                >
                  Data{getSortIndicator('requestDate')}
                </div>
                <div className="col-span-1 text-center">Hamb.</div>
                <div className="col-span-1 text-center">Bisn.</div>
                <div className="col-span-1 text-center">Bag.</div>
                <div className="col-span-3 text-center">Ações</div>
              </div>

              <div className="divide-y divide-gray-100">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, index) => (
                    <div 
                      key={order.id} 
                      className={`grid grid-cols-12 gap-4 items-center px-4 py-3 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-brand-light/30'} hover:bg-brand-light/50 transition-colors`}
                    >
                      <div className="col-span-4 font-medium text-brand-dark truncate" title={order.clientName}>
                        {order.clientName}
                      </div>
                      <div className="col-span-2 text-gray-700 truncate">
                        {formatDate(order.requestDate)}
                      </div>
                      <div className="col-span-1 text-gray-700 text-center">
                        {order.hamburgerBuns}
                      </div>
                      <div className="col-span-1 text-gray-700 text-center">
                        {order.bisnagaBuns}
                      </div>
                      <div className="col-span-1 text-gray-700 text-center">
                        {order.baguettes}
                      </div>
                      <div className="col-span-3 flex justify-center space-x-2 z-10">
                        <button
                          type="button"
                          onClick={(e) => handleEditClick(e, order)}
                          className="group relative z-20 text-brand-primary hover:text-brand-dark transition-colors p-1 rounded-full hover:bg-brand-light cursor-pointer flex items-center gap-1"
                        >
                          <EditIcon />
                          <span className="text-xs font-semibold">Editar</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                      {searchTerm ? 'Nenhum pedido encontrado para esta busca.' : 'Nenhum pedido registrado ainda.'}
                  </div>
                )}
              </div>
            </div>

            {/* === MODO MOBILE (Cards) - Visível apenas em telas pequenas === */}
            <div className="md:hidden flex flex-col gap-4">
               {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <div key={order.id} className="bg-white border border-brand-primary/20 rounded-lg shadow-sm p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-brand-dark text-lg">{order.clientName}</h4>
                                <p className="text-sm text-gray-500">{formatDate(order.requestDate)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => handleEditClick(e, order)}
                                className="bg-brand-light text-brand-primary p-2 rounded-full hover:bg-brand-primary/10 transition-colors"
                            >
                                <EditIcon />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-gray-50 p-2 rounded text-center">
                                <span className="block text-xs font-bold text-brand-primary uppercase">Hamb.</span>
                                <span className="text-sm font-semibold text-brand-dark">{order.hamburgerBuns}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded text-center">
                                <span className="block text-xs font-bold text-brand-primary uppercase">Bisn.</span>
                                <span className="text-sm font-semibold text-brand-dark">{order.bisnagaBuns}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded text-center">
                                <span className="block text-xs font-bold text-brand-primary uppercase">Bag.</span>
                                <span className="text-sm font-semibold text-brand-dark">{order.baguettes}</span>
                            </div>
                        </div>
                    </div>
                  ))
               ) : (
                  <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                      {searchTerm ? 'Nenhum pedido encontrado.' : 'Nenhum pedido registrado ainda.'}
                  </div>
               )}
            </div>

          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-2 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{startIndex + 1}</span> até <span className="font-medium">{Math.min(startIndex + itemsPerPage, sortedAndFilteredOrders.length)}</span> de <span className="font-medium">{sortedAndFilteredOrders.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Anterior</span>
                      <ChevronLeftIcon />
                    </button>
                    
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-white">
                      Página {currentPage} de {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Próximo</span>
                      <ChevronRightIcon />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header do Modal */}
            <div className={`px-6 py-4 flex justify-between items-center ${showDeleteConfirm ? 'bg-red-600' : 'bg-brand-primary'}`}>
              <h3 className="text-lg font-bold text-white">
                {showDeleteConfirm ? 'Confirmar Exclusão' : 'Detalhes do Pedido'}
              </h3>
              <button 
                onClick={handleCancelEdit}
                className="text-white/80 hover:text-white transition-colors focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Conteúdo do Modal */}
            {showDeleteConfirm ? (
                // Tela de Confirmação de Exclusão
                <div className="p-6 text-center space-y-6">
                    <div className="flex justify-center text-red-500">
                        <TrashIcon className="w-16 h-16 stroke-2" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg text-gray-800 font-medium">
                            Tem certeza que deseja excluir o pedido de <span className="font-bold">{editingOrder.clientName}</span>?
                        </p>
                        <p className="text-sm text-red-600 font-semibold">
                            ⚠️ Esta ação é permanente e não pode ser desfeita.
                        </p>
                    </div>
                    <div className="flex justify-center gap-4 pt-2">
                        <Button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 shadow-none"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                        >
                            Sim, Excluir Pedido
                        </Button>
                    </div>
                </div>
            ) : (
                // Formulário de Edição
                <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                    <Input
                        id="edit-client"
                        label="Nome do Cliente"
                        value={editingOrder.clientName}
                        onChange={(e) => setEditingOrder({ ...editingOrder, clientName: e.target.value })}
                        required
                    />
                    
                    <Input
                        id="edit-date"
                        label="Data da Requisição"
                        type="date"
                        value={editingOrder.requestDate}
                        onChange={(e) => setEditingOrder({ ...editingOrder, requestDate: e.target.value })}
                        required
                    />
                    
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                        id="edit-hamburger"
                        label="Hamb."
                        type="number"
                        value={editingOrder.hamburgerBuns.toString()}
                        onChange={(e) => setEditingOrder({ ...editingOrder, hamburgerBuns: parseInt(e.target.value, 10) || 0 })}
                        min="0"
                        />
                        <Input
                        id="edit-bisnaga"
                        label="Bisn."
                        type="number"
                        value={editingOrder.bisnagaBuns.toString()}
                        onChange={(e) => setEditingOrder({ ...editingOrder, bisnagaBuns: parseInt(e.target.value, 10) || 0 })}
                        min="0"
                        />
                        <Input
                        id="edit-baguette"
                        label="Bag."
                        type="number"
                        value={editingOrder.baguettes.toString()}
                        onChange={(e) => setEditingOrder({ ...editingOrder, baguettes: parseInt(e.target.value, 10) || 0 })}
                        min="0"
                        />
                    </div>

                    {/* Footer com Botão de Excluir */}
                    <div className="flex justify-between items-center pt-6 mt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-bold"
                        >
                            <TrashIcon className="w-5 h-5 mr-1.5" />
                            Excluir Pedido
                        </button>

                        <div className="flex space-x-3">
                            <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm"
                            >
                            Cancelar
                            </button>
                            <Button type="submit" className="py-2 px-6 text-sm">
                            Salvar Alterações
                            </Button>
                        </div>
                    </div>
                </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
