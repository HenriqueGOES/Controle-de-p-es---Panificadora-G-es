
import type { Order } from '../types';

interface BreadData {
  "Pães de Hambúrguer": number;
  "Pães de Hambúrguer Médio": number;
  "Pães de Bisnaga": number;
  "Baguetes": number;
}

const initialBreadData: BreadData = {
  "Pães de Hambúrguer": 0,
  "Pães de Hambúrguer Médio": 0,
  "Pães de Bisnaga": 0,
  "Baguetes": 0,
};

// Helper to get date object from ISO string, ignoring time
const getDateFromISO = (isoString: string): Date | null => {
  if (!isoString || !/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
    return null;
  }
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) {
      return null;
  }
  return date;
};

// Daily Data (last 7 days)
export const getDailyData = (orders: Order[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dailyCounts = new Map<string, BreadData>();
  const labels: string[] = [];
  const dayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit' });

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const label = dayFormatter.format(date).replace('.', '');
    labels.push(label);
    dailyCounts.set(dateString, { ...initialBreadData });
  }

  orders.forEach(order => {
    if (!order.requestDate) return;
    const date = order.requestDate;
    if (dailyCounts.has(date)) {
      const currentCounts = dailyCounts.get(date)!;
      currentCounts["Pães de Hambúrguer"] += order.hamburgerBuns || 0;
      currentCounts["Pães de Hambúrguer Médio"] += order.mediumHamburgerBuns || 0;
      currentCounts["Pães de Bisnaga"] += order.bisnagaBuns || 0;
      currentCounts["Baguetes"] += order.baguettes || 0;
    }
  });
  
  return labels.map((label, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const dateString = date.toISOString().split('T')[0];
    return { name: label, ...(dailyCounts.get(dateString) || initialBreadData) };
  });
};

// Weekly Data (last 4 weeks)
export const getWeeklyData = (orders: Order[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weeklyData: ({ name: string } & BreadData)[] = [];

    for (let i = 3; i >= 0; i--) {
        const weekEndDate = new Date(today);
        weekEndDate.setDate(today.getDate() - i * 7);
        const weekStartDate = new Date(weekEndDate);
        weekStartDate.setDate(weekEndDate.getDate() - 6);
        
        const weekOrders = orders.filter(order => {
            const orderDate = getDateFromISO(order.requestDate);
            return orderDate && orderDate >= weekStartDate && orderDate <= weekEndDate;
        });

        const weeklyTotals = weekOrders.reduce((acc, order) => {
          acc["Pães de Hambúrguer"] += order.hamburgerBuns || 0;
          acc["Pães de Hambúrguer Médio"] += order.mediumHamburgerBuns || 0;
          acc["Pães de Bisnaga"] += order.bisnagaBuns || 0;
          acc["Baguetes"] += order.baguettes || 0;
          return acc;
        }, { ...initialBreadData });
        
        const startDay = weekStartDate.getDate();
        const endDay = weekEndDate.getDate();
        const startMonth = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(weekStartDate).replace('.', '');
        const endMonth = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(weekEndDate).replace('.', '');

        const name = startMonth === endMonth
            ? `${startDay}-${endDay} ${startMonth}`
            : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;

        weeklyData.push({
            name,
            ...weeklyTotals
        });
    }
    return weeklyData;
};

// Monthly Data (last 12 months)
export const getMonthlyData = (orders: Order[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const monthlyCounts = new Map<string, BreadData>(); // "YYYY-MM" -> count
  const labels: {name: string, key: string}[] = [];
  const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
  
  for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const key = `${year}-${month}`;
      const label = `${monthFormatter.format(date).replace('.','')}/${year.toString().slice(-2)}`;
      labels.push({name: label, key});
      monthlyCounts.set(key, { ...initialBreadData });
  }

  orders.forEach(order => {
      const orderDate = getDateFromISO(order.requestDate);
      if (!orderDate) return;

      const year = orderDate.getFullYear();
      const month = (orderDate.getMonth() + 1).toString().padStart(2, '0');
      const key = `${year}-${month}`;

      if (monthlyCounts.has(key)) {
          const currentCounts = monthlyCounts.get(key)!;
          currentCounts["Pães de Hambúrguer"] += order.hamburgerBuns || 0;
          currentCounts["Pães de Hambúrguer Médio"] += order.mediumHamburgerBuns || 0;
          currentCounts["Pães de Bisnaga"] += order.bisnagaBuns || 0;
          currentCounts["Baguetes"] += order.baguettes || 0;
      }
  });

  return labels.map(labelInfo => ({
      name: labelInfo.name,
      ...(monthlyCounts.get(labelInfo.key) || initialBreadData)
  }));
};
