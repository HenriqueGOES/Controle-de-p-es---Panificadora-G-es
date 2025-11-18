
import { useState, useEffect, useCallback } from 'react';
import type { Order } from '../types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem('panificadora-goes-orders');
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed)) {
          // Validate and filter orders to prevent app crashes due to corrupted data
          // Also coerce numeric values to ensure math operations work correctly
          const validOrders = parsed
            .filter((order: any) => 
              order && 
              typeof order === 'object' && 
              typeof order.clientName === 'string' &&
              typeof order.id === 'string' &&
              typeof order.requestDate === 'string'
            )
            .map((order: any) => ({
              ...order,
              hamburgerBuns: Number(order.hamburgerBuns) || 0,
              bisnagaBuns: Number(order.bisnagaBuns) || 0,
              baguettes: Number(order.baguettes) || 0,
            }));
          
          setOrders(validOrders);
        }
      }
    } catch (error) {
      console.error("Failed to load orders from localStorage", error);
      // Optionally clear corrupted storage if parsing fails completely
      // localStorage.removeItem('panificadora-goes-orders');
    }
  }, []);

  const saveOrders = useCallback((updatedOrders: Order[]) => {
    try {
      localStorage.setItem('panificadora-goes-orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Failed to save orders to localStorage", error);
    }
  }, []);

  const addOrder = useCallback((newOrderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: new Date().toISOString() + Math.random(), // Simple unique ID
    };
    setOrders(prevOrders => {
      const updatedOrders = [...prevOrders, newOrder];
      saveOrders(updatedOrders);
      return updatedOrders;
    });
  }, [saveOrders]);

  return { orders, addOrder };
};
