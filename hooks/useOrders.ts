import { useState, useEffect, useCallback } from 'react';
import type { Order } from '../types';
import { supabase } from '../lib/supabaseClient';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para buscar os pedidos do Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('request_date', { ascending: false });

      if (error) throw error;

      if (data) {
        // Mapeia os campos do banco (snake_case) para o app (camelCase)
        const formattedOrders: Order[] = data.map((item: any) => ({
          id: item.id,
          clientName: item.client_name,
          hamburgerBuns: item.hamburger_buns,
          bisnagaBuns: item.bisnaga_buns,
          baguettes: item.baguettes,
          requestDate: item.request_date,
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      alert("Erro ao conectar com o banco de dados. Verifique suas chaves no arquivo lib/supabaseClient.ts");
    } finally {
      setLoading(false);
    }
  };

  // Busca inicial
  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = useCallback(async (newOrderData: Omit<Order, 'id'>) => {
    try {
      // Mapeia os campos do app para o banco de dados
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            client_name: newOrderData.clientName,
            hamburger_buns: newOrderData.hamburgerBuns,
            bisnaga_buns: newOrderData.bisnagaBuns,
            baguettes: newOrderData.baguettes,
            request_date: newOrderData.requestDate,
          },
        ])
        .select();

      if (error) throw error;

      // Atualiza a lista localmente após o sucesso
      if (data) {
        fetchOrders(); // Recarrega para garantir sincronia e ordenação
      }
    } catch (error) {
      console.error("Erro ao adicionar pedido:", error);
      alert("Erro ao salvar o pedido. Tente novamente.");
    }
  }, []);

  const importOrders = useCallback(async (importedOrders: any[]) => {
      try {
        // Validação e formatação para o Supabase
        const validOrders = importedOrders
          .filter((order: any) => 
            order && 
            typeof order.clientName === 'string' &&
            typeof order.requestDate === 'string'
          )
          .map((order: any) => ({
            client_name: order.clientName,
            hamburger_buns: Number(order.hamburgerBuns) || 0,
            bisnaga_buns: Number(order.bisnagaBuns) || 0,
            baguettes: Number(order.baguettes) || 0,
            request_date: order.requestDate,
            // Não enviamos o ID, deixamos o Supabase gerar novos UUIDs
          }));

        if (validOrders.length === 0) {
            alert("Nenhum pedido válido encontrado no arquivo.");
            return;
        }

        const { error } = await supabase
          .from('orders')
          .insert(validOrders);

        if (error) throw error;

        fetchOrders(); // Recarrega tudo
        alert(`${validOrders.length} pedidos importados com sucesso para o banco de dados!`);

      } catch (error) {
        console.error("Erro ao importar pedidos:", error);
        alert("Erro ao importar dados para o servidor.");
      }
  }, []);

  return { orders, addOrder, importOrders, loading };
};