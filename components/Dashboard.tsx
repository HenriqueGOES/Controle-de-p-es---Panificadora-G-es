
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Order } from '../types';
import { Card } from './ui/Card';
import { getDailyData, getWeeklyData, getMonthlyData } from '../utils/dateUtils';
import { OrderList } from './OrderList';

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

  const totalOrders = orders.length;
  const today = new Date().toISOString().split('T')[0];
  // Safety check: ensure 'o' is defined before accessing requestDate
  const todaysOrders = orders.filter(o => o && o.requestDate === today).length;

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
            <BarChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#1E3A8A" tick={{fontSize: 12}} />
              <YAxis allowDecimals={false} stroke="#1E3A8A" tick={{fontSize: 12}} />
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
            <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#1E3A8A" tick={{fontSize: 12}} />
              <YAxis allowDecimals={false} stroke="#1E3A8A" tick={{fontSize: 12}} />
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
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="name" stroke="#1E3A8A" tick={{fontSize: 12}} />
            <YAxis allowDecimals={false} stroke="#1E3A8A" tick={{fontSize: 12}} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="Pães de Hambúrguer" stackId="a" fill="#3B82F6" name="Hambúrguer" />
            <Bar dataKey="Pães de Bisnaga" stackId="a" fill="#FBBF24" name="Bisnaga" />
            <Bar dataKey="Baguetes" stackId="a" fill="#FDE047" name="Baguete" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <OrderList orders={orders} />
    </div>
  );
};
