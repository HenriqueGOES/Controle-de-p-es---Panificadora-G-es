
import { useState, useEffect, useCallback } from 'react';
import type { Order } from '../types';
import { supabase } from '../lib/supabaseClient';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para buscar os pedidos do Supabase
  const fetchOrders = async () => {
    try {
      // Não ativamos loading aqui para não piscar a tela em atualizações realtime
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
    } finally {
      setLoading(false);
    }
  };

  // Busca inicial e Configuração do Realtime
  useEffect(() => {
    fetchOrders();

    // Inscreve-se para ouvir qualquer mudança na tabela 'orders'
    const channel = supabase
      .channel('orders_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          // Se houver qualquer mudança (Insert, Update, Delete), recarrega a lista
          fetchOrders();
        }
      )
      .subscribe();

    // Limpeza ao desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addOrder = useCallback(async (newOrderData: Omit<Order, 'id'>) => {
    try {
      // Mapeia os campos do app para o banco de dados
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            client_name: newOrderData.clientName,
            hamburger_buns: newOrderData.hamburgerBuns,
            bisnaga_buns: newOrderData.bisnagaBuns,
            baguettes: newOrderData.baguettes,
            request_date: newOrderData.requestDate,
          },
        ]);

      if (error) throw error;
      // Não precisa chamar fetchOrders() aqui, o realtime fará isso automaticamente
    } catch (error) {
      console.error("Erro ao adicionar pedido:", error);
      alert("Erro ao salvar o pedido. Tente novamente.");
    }
  }, []);

  const updateOrder = useCallback(async (id: string, updatedData: Partial<Order>) => {
    try {
      // Prepara o objeto para update mapeando para snake_case
      const dbData: any = {};
      if (updatedData.clientName !== undefined) dbData.client_name = updatedData.clientName;
      if (updatedData.hamburgerBuns !== undefined) dbData.hamburger_buns = updatedData.hamburgerBuns;
      if (updatedData.bisnagaBuns !== undefined) dbData.bisnaga_buns = updatedData.bisnagaBuns;
      if (updatedData.baguettes !== undefined) dbData.baguettes = updatedData.baguettes;
      if (updatedData.requestDate !== undefined) dbData.request_date = updatedData.requestDate;

      const { error } = await supabase
        .from('orders')
        .update(dbData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      alert("Erro ao atualizar o pedido.");
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
      alert("Erro ao deletar o pedido.");
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

        alert(`${validOrders.length} pedidos importados com sucesso para o banco de dados!`);

      } catch (error) {
        console.error("Erro ao importar pedidos:", error);
        alert("Erro ao importar dados para o servidor.");
      }
  }, []);

  return { orders, addOrder, updateOrder, deleteOrder, importOrders, loading };
};
