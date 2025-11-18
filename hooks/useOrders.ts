
import { useState, useEffect, useCallback } from 'react';
import type { Order } from '../types';
import { supabase } from '../lib/supabaseClient';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para extrair mensagem de erro legível
  const getErrorMessage = (error: any): string => {
    if (!error) return 'Erro desconhecido';
    
    // Log para ajudar no debug
    console.log('Analisando erro:', error);

    // Se for string, retorna direto
    if (typeof error === 'string') return error;
    
    // Se for instância de Error padrão
    if (error instanceof Error) return error.message;

    // Erros específicos do Postgres/Supabase (PostgrestError)
    // 42501: Insufficient privilege (RLS active)
    if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
      return 'BLOQUEIO DE SEGURANÇA (RLS).\n\nO Supabase impediu a gravação.\nSOLUÇÃO: Vá no SQL Editor do Supabase e rode:\n\nALTER TABLE orders DISABLE ROW LEVEL SECURITY;';
    }
    if (error.code === '23505') {
      return 'Este pedido já existe (Registro duplicado).';
    }

    // Tenta extrair mensagem de propriedades comuns de erro
    const possibleMessage = error.message || error.error_description || error.details || error.hint;
    if (possibleMessage) {
      return String(possibleMessage);
    }
    
    // Último recurso: Tenta converter o objeto inteiro para JSON
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error); // Fallback final se não for serializável
    }
  };

  // Função auxiliar para buscar os pedidos do Supabase
  const fetchOrders = useCallback(async () => {
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
    } catch (error: any) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, [fetchOrders]);

  const addOrder = useCallback(async (newOrderData: Omit<Order, 'id'>) => {
    try {
      console.log("Enviando pedido para Supabase:", newOrderData);

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
      
      // Força a atualização da lista localmente para garantir feedback imediato
      await fetchOrders();
      
    } catch (error: any) {
      const msg = getErrorMessage(error);
      // Só loga o JSON completo se não for um erro conhecido de RLS, para limpar o console
      if (error.code !== '42501') {
          console.error("Erro detalhado ao adicionar:", JSON.stringify(error, null, 2));
      }
      alert(`Erro ao salvar: ${msg}`);
    }
  }, [fetchOrders]);

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
      
      await fetchOrders();
      alert("Pedido atualizado com sucesso!");

    } catch (error: any) {
      const msg = getErrorMessage(error);
      if (error.code !== '42501') {
        console.error("Erro detalhado ao atualizar:", JSON.stringify(error, null, 2));
      }
      alert(`Erro ao atualizar: ${msg}`);
    }
  }, [fetchOrders]);

  const deleteOrder = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchOrders();
      alert("Pedido excluído com sucesso!");

    } catch (error: any) {
      const msg = getErrorMessage(error);
      if (error.code !== '42501') {
        console.error("Erro detalhado ao deletar:", JSON.stringify(error, null, 2));
      }
      alert(`Erro ao deletar: ${msg}`);
    }
  }, [fetchOrders]);

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

        await fetchOrders();
        alert(`${validOrders.length} pedidos importados com sucesso para o banco de dados!`);

      } catch (error: any) {
        const msg = getErrorMessage(error);
        console.error("Erro detalhado ao importar:", JSON.stringify(error, null, 2));
        alert(`Erro ao importar dados: ${msg}`);
      }
  }, [fetchOrders]);

  return { orders, addOrder, updateOrder, deleteOrder, importOrders, loading };
};
