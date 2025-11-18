
import React, { useState, useMemo } from 'react';
import type { Order } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';

interface OrderListProps {
  orders: Order[];
}

type SortKey = 'clientName' | 'requestDate';

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({
    key: 'requestDate',
    direction: 'descending',
  });

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
      // Check for invalid date
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return new Intl.DateTimeFormat('pt-BR').format(date);
    } catch (error) {
      return 'Data inválida';
    }
  }

  return (
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
        <div className="mt-4 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
          <table className="min-w-full divide-y divide-brand-primary/20">
            <thead className="bg-brand-light">
              <tr>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-brand-primary uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort('clientName')}
                >
                  Cliente{getSortIndicator('clientName')}
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-brand-primary uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort('requestDate')}
                >
                  Data{getSortIndicator('requestDate')}
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-brand-primary uppercase tracking-wider whitespace-nowrap">
                  Hambúrguer
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-brand-primary uppercase tracking-wider whitespace-nowrap">
                  Bisnaga
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-brand-primary uppercase tracking-wider whitespace-nowrap">
                  Baguete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredOrders.length > 0 ? (
                sortedAndFilteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-light/50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-dark">{order.clientName}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(order.requestDate)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.hamburgerBuns}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.bisnagaBuns}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.baguettes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 sm:px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'Nenhum pedido encontrado para a busca.' : 'Nenhum pedido registrado ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
