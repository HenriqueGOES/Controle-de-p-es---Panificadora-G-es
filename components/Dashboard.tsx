
import React, { useMemo, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Order } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { getDailyData, getWeeklyData, getMonthlyData } from '../utils/dateUtils';
import { OrderList } from './OrderList';
import { useOrders } from '../hooks/useOrders';

interface DashboardProps {
  orders: Order[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-brand-dark mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.fill }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Card>
      <div className="p-4 sm:p-6 h-80 sm:h-96">
        <h3 className="text-lg font-semibold font-serif text-brand-dark mb-4">{title}</h3>
        {children}
      </div>
    </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const dailyData = useMemo(() => getDailyData(orders), [orders]);
  const weeklyData = useMemo(() => getWeeklyData(orders), [orders]);
  const monthlyData = useMemo(() => getMonthlyData(orders), [orders]);
  const { importOrders, deleteOrder, updateOrder } = useOrders();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalOrders = orders.length;
  const today = new Date().toISOString().split('T')[0];
  // Safety check: ensure 'o' is defined before accessing requestDate
  const todaysOrders = orders.filter(o => o && o.requestDate === today).length;

  const handleExport = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `backup_panificadora_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const importedData = JSON.parse(text);
          if (Array.isArray(importedData)) {
             if (window.confirm('Isso irá substituir todos os pedidos atuais pelos do arquivo. Tem certeza?')) {
                importOrders(importedData);
                alert('Dados restaurados com sucesso!');
             }
          } else {
            alert('O arquivo selecionado não contém uma lista válida de pedidos.');
          }
        }
      } catch (error) {
        console.error('Erro ao importar:', error);
        alert('Erro ao ler o arquivo. Verifique se é um backup válido.');
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(fileObj);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
                <div className="p-4 sm:p-6">
                    <h3 className="text-sm sm:text-md font-semibold text-brand-primary uppercase tracking-wider">Total de Pedidos</h3>
                    <p className="text-3xl sm:text-4xl font-bold text-brand-dark mt-2">{totalOrders}</p>
                </div>
            </Card>
            <Card>
                <div className="p-4 sm:p-6">
                    <h3 className="text-sm sm:text-md font-semibold text-brand-primary uppercase tracking-wider">Pedidos Hoje</h3>
                    <p className="text-3xl sm:text-4xl font-bold text-brand-dark mt-2">{todaysOrders}</p>
                </div>
            </Card>
        </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <ChartCard title="Pães pedidos nos Últimos 7 Dias">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#1E3A8A" tick={{fontSize: 11}} interval={0} />
              <YAxis allowDecimals={false} stroke="#1E3A8A" tick={{fontSize: 11}} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Pães de Hambúrguer" stackId="a" fill="#3B82F6" name="Hambúrguer" />
              <Bar dataKey="Pães de Bisnaga" stackId="a" fill="#FBBF24" name="Bisnaga" />
              <Bar dataKey="Baguetes" stackId="a" fill="#FDE047" name="Baguete" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pães pedidos nas Últimas 4 Semanas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#1E3A8A" tick={{fontSize: 11}} interval={0} />
              <YAxis allowDecimals={false} stroke="#1E3A8A" tick={{fontSize: 11}} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Pães de Hambúrguer" stackId="a" fill="#3B82F6" name="Hambúrguer" />
              <Bar dataKey="Pães de Bisnaga" stackId="a" fill="#FBBF24" name="Bisnaga" />
              <Bar dataKey="Baguetes" stackId="a" fill="#FDE047" name="Baguete" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Pães pedidos nos Últimos 12 Meses">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="name" stroke="#1E3A8A" tick={{fontSize: 11}} interval={0} />
            <YAxis allowDecimals={false} stroke="#1E3A8A" tick={{fontSize: 11}} width={30} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="Pães de Hambúrguer" stackId="a" fill="#3B82F6" name="Hambúrguer" />
            <Bar dataKey="Pães de Bisnaga" stackId="a" fill="#FBBF24" name="Bisnaga" />
            <Bar dataKey="Baguetes" stackId="a" fill="#FDE047" name="Baguete" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <OrderList 
        orders={orders} 
        onDelete={deleteOrder}
        onUpdate={updateOrder}
      />

      <Card>
        <div className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold font-serif text-brand-dark mb-4">Gerenciamento de Dados</h3>
            <p className="text-sm text-gray-600 mb-4">
                Faça o backup dos seus pedidos para não perder informações ou para transferi-las para outro dispositivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleExport} className="flex-1 bg-green-600 hover:bg-green-700">
                    💾 Baixar Backup (JSON)
                </Button>
                <Button onClick={handleImportClick} className="flex-1 bg-brand-secondary text-brand-dark hover:bg-yellow-500">
                    📂 Restaurar Backup
                </Button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{display: 'none'}} 
                    accept=".json" 
                    onChange={handleFileChange}
                />
            </div>
        </div>
      </Card>
    </div>
  );
};
