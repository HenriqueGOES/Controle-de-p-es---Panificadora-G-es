
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Order } from '../types';
import { Card } from './ui/Card';

interface FinancialProps {
  orders: Order[];
}

const PRICES = {
  hamburger: 4.30,
  mediumHamburger: 3.80, // Novo preço
  bisnaga: 4.80,
  baguette: 5.00
};

interface FinancialSummary {
  hamburgerQty: number;
  mediumHamburgerQty: number;
  bisnagaQty: number;
  baguetteQty: number;
  hamburgerTotal: number;
  mediumHamburgerTotal: number;
  bisnagaTotal: number;
  baguetteTotal: number;
  grandTotal: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-brand-dark mb-2">{label}</p>
        <p className="text-brand-primary font-medium">
          Receita: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const FinancialTable = ({ title, data }: { title: string, data: FinancialSummary }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
    <Card className="h-full">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold font-serif text-brand-dark mb-4">{title}</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
          <table className="min-w-full divide-y divide-brand-primary/20">
            <thead className="bg-brand-light">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-brand-primary uppercase whitespace-nowrap">Tipo de Pão</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-brand-primary uppercase whitespace-nowrap">Qtd.</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-brand-primary uppercase whitespace-nowrap">Valor Unit.</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-brand-primary uppercase whitespace-nowrap">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-3 py-3 text-sm font-medium text-brand-dark">Hambúrguer</td>
                <td className="px-3 py-3 text-sm text-right text-gray-600">{data.hamburgerQty}</td>
                <td className="px-3 py-3 text-sm text-right text-gray-600">{formatCurrency(PRICES.hamburger)}</td>
                <td className="px-3 py-3 text-sm text-right font-semibold text-brand-primary">{formatCurrency(data.hamburgerTotal)}</td>
              </tr>
              <tr>
                <td className="px-3 py-3 text-sm font-medium text-brand-dark">Hamb. Médio</td>
                <td className="px-3 py-3 text-sm text-right text-gray-600">{data.mediumHamburgerQty}</td>
                <td className="px-3 py-3 text-sm text-right text-gray-600">{formatCurrency(PRICES.mediumHamburger)}</td>
                <td className="px-3 py-3 text-sm text-right font-semibold text-brand-primary">{formatCurrency(data.mediumHamburgerTotal)}</td>
              </tr>
              <tr>
                <td className="px-3 py-3 text-sm font-medium text-brand-dark">Bisnaga</td>
                <td className="px-3 py-3 text-sm text-right text-gray-600">{data.bisnagaQty}</td>
                <td className="px-3 py-3 text-sm text-right text-gray-600">{formatCurrency(PRICES.bisnaga)}</td>
                <td className="px-3 py-3 text-sm text-right font-semibold text-brand-primary">{formatCurrency(data.bisnagaTotal)}</td>
              </tr>
              <tr>
                <td className="px-3 py-3 text-sm font-medium text-brand-dark">Baguete</td>
                <td className="px-3 py-3 text-sm text-right text-gray-600">{data.baguetteQty}</td>
                <td className="px-3 py-3 text-sm text-right text-gray-600">{formatCurrency(PRICES.baguette)}</td>
                <td className="px-3 py-3 text-sm text-right font-semibold text-brand-primary">{formatCurrency(data.baguetteTotal)}</td>
              </tr>
              <tr className="bg-brand-primary/5">
                <td colSpan={3} className="px-3 py-3 text-sm font-bold text-brand-dark text-right">Total Recebido:</td>
                <td className="px-3 py-3 text-sm font-bold text-brand-dark text-right">{formatCurrency(data.grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
    );
};

export const Financial: React.FC<FinancialProps> = ({ orders }) => {
  
  const calculateFinancials = (filteredOrders: Order[]): FinancialSummary => {
    const summary = {
      hamburgerQty: 0,
      mediumHamburgerQty: 0,
      bisnagaQty: 0,
      baguetteQty: 0,
      hamburgerTotal: 0,
      mediumHamburgerTotal: 0,
      bisnagaTotal: 0,
      baguetteTotal: 0,
      grandTotal: 0,
    };

    filteredOrders.forEach(order => {
      if (!order) return; // Safety check
      summary.hamburgerQty += order.hamburgerBuns || 0;
      summary.mediumHamburgerQty += order.mediumHamburgerBuns || 0;
      summary.bisnagaQty += order.bisnagaBuns || 0;
      summary.baguetteQty += order.baguettes || 0;
    });

    summary.hamburgerTotal = summary.hamburgerQty * PRICES.hamburger;
    summary.mediumHamburgerTotal = summary.mediumHamburgerQty * PRICES.mediumHamburger;
    summary.bisnagaTotal = summary.bisnagaQty * PRICES.bisnaga;
    summary.baguetteTotal = summary.baguetteQty * PRICES.baguette;
    summary.grandTotal = summary.hamburgerTotal + summary.mediumHamburgerTotal + summary.bisnagaTotal + summary.baguetteTotal;

    return summary;
  };

  const today = new Date().toISOString().split('T')[0];
  
  const dailyData = useMemo(() => {
    const todaysOrders = orders.filter(o => o && o.requestDate === today);
    return calculateFinancials(todaysOrders);
  }, [orders, today]);

  const monthlyData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthsOrders = orders.filter(o => {
       if (!o || typeof o.requestDate !== 'string') return false;
       // Ensure we can split safely
       const parts = o.requestDate.split('-');
       if (parts.length !== 3) return false;
       
       const [year, month] = parts.map(Number);
       return year === currentYear && (month - 1) === currentMonth;
    });
    return calculateFinancials(monthsOrders);
  }, [orders]);

  const chartData = [
    { name: 'Hambúrguer', value: monthlyData.hamburgerTotal, color: '#3B82F6' },
    { name: 'Hamb. Médio', value: monthlyData.mediumHamburgerTotal, color: '#FB923C' }, // Orange
    { name: 'Bisnaga', value: monthlyData.bisnagaTotal, color: '#FBBF24' },
    { name: 'Baguete', value: monthlyData.baguetteTotal, color: '#FDE047' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <FinancialTable title="Faturamento de Hoje" data={dailyData} />
        <FinancialTable title="Faturamento Mensal" data={monthlyData} />
      </div>

      <Card>
        <div className="p-4 sm:p-6 h-80 sm:h-96">
          <h3 className="text-lg font-semibold font-serif text-brand-dark mb-4">Receita Mensal por Tipo de Pão</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} vertical={false} />
              <XAxis dataKey="name" stroke="#1E3A8A" tick={{fontSize: 11}} />
              <YAxis stroke="#1E3A8A" tickFormatter={(value) => `R$${value}`} tick={{fontSize: 11}} width={60} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
