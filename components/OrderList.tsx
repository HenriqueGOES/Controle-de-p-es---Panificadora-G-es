
import React, { useState, useMemo } from 'react';
import type { Order } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import * as ReactWindow from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Workaround for ESM environments where react-window might be exported as a default object
const List = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList;
const areEqual = (ReactWindow as any).areEqual || (ReactWindow as any).default?.areEqual;

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

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: Order[];
    formatDate: (date: string) => string;
    handleEditClick: (order: Order) => void;
    handleDelete: (id: string) => void;
  };
}

const Row = React.memo(({ index, style, data }: RowProps) => {
  const order = data.items[index];
  const isEven = index % 2 === 0;

  return (
    <div 
      style={style} 
      className={`grid grid-cols-12 gap-4 items-center px-4 border-b border-gray-100 text-sm ${isEven ? 'bg-white' : 'bg-brand-light/30'} hover:bg-brand-light/50 transition-colors`}
    >
      <div className="col-span-4 font-medium text-brand-dark truncate" title={order.clientName}>
        {order.clientName}
      </div>
      <div className="col-span-2 text-gray-700 truncate">
        {data.formatDate(order.requestDate)}
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
      <div className="col-span-3 flex justify-center space-x-2">
        <button
          onClick={() => data.handleEditClick(order)}
          className="text-brand-primary hover:text-brand-dark transition-colors p-1 rounded-full hover:bg-brand-light"
          title="Editar"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => data.handleDelete(order.id)}
          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
          title="Excluir"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}, areEqual);

export const OrderList: React.FC<OrderListProps> = ({ orders, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({
    key: 'requestDate',
    direction: 'descending',
  });
  
  // State for Edit Modal
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      onDelete?.(id);
    }
  };

  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
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
  };

  const itemData = useMemo(() => ({
    items: sortedAndFilteredOrders,
    formatDate,
    handleEditClick,
    handleDelete
  }), [sortedAndFilteredOrders]);

  return (
    <>
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold font-serif text-brand-dark mb-4">Histórico de Pedidos</h3>
          <Input
            id="search-client"
            label="Buscar por Cliente"
            type="text"
            placeholder="Digite o nome do cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="mt-4 h-[500px] w-full border rounded-lg border-brand-primary/20 bg-white">
            <div className="overflow-x-auto h-full">
              {/* Container with min-width to ensure columns don't collapse on mobile */}
              <div className="min-w-[900px] h-full flex flex-col">
                
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 bg-brand-light border-b border-brand-primary/20 py-3 px-4 text-xs font-medium text-brand-primary uppercase tracking-wider">
                  <div 
                    className="col-span-4 cursor-pointer flex items-center"
                    onClick={() => requestSort('clientName')}
                  >
                    Cliente{getSortIndicator('clientName')}
                  </div>
                  <div 
                    className="col-span-2 cursor-pointer flex items-center"
                    onClick={() => requestSort('requestDate')}
                  >
                    Data{getSortIndicator('requestDate')}
                  </div>
                  <div className="col-span-1 text-center">Hamb.</div>
                  <div className="col-span-1 text-center">Bisn.</div>
                  <div className="col-span-1 text-center">Bag.</div>
                  <div className="col-span-3 text-center">Ações</div>
                </div>

                {/* Virtualized List */}
                <div className="flex-1">
                  {sortedAndFilteredOrders.length > 0 && List ? (
                    <AutoSizer>
                      {({ height, width }) => (
                        <List
                          height={height}
                          width={width}
                          itemCount={sortedAndFilteredOrders.length}
                          itemSize={52} // Height of each row
                          itemData={itemData}
                        >
                          {Row}
                        </List>
                      )}
                    </AutoSizer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                       {searchTerm ? 'Nenhum pedido encontrado para esta busca.' : 'Nenhum pedido registrado ainda.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div className="bg-brand-primary px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Editar Pedido</h3>
              <button 
                onClick={handleCancelEdit}
                className="text-white/80 hover:text-white transition-colors focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
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
                  label="Hambúrguer"
                  type="number"
                  value={editingOrder.hamburgerBuns.toString()}
                  onChange={(e) => setEditingOrder({ ...editingOrder, hamburgerBuns: parseInt(e.target.value, 10) || 0 })}
                  min="0"
                />
                <Input
                  id="edit-bisnaga"
                  label="Bisnaga"
                  type="number"
                  value={editingOrder.bisnagaBuns.toString()}
                  onChange={(e) => setEditingOrder({ ...editingOrder, bisnagaBuns: parseInt(e.target.value, 10) || 0 })}
                  min="0"
                />
                <Input
                  id="edit-baguette"
                  label="Baguete"
                  type="number"
                  value={editingOrder.baguettes.toString()}
                  onChange={(e) => setEditingOrder({ ...editingOrder, baguettes: parseInt(e.target.value, 10) || 0 })}
                  min="0"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <Button type="submit" className="py-2 px-6">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
