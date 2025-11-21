
import { useState, useEffect, useCallback } from 'react';
import type { Client } from '../types';
import { supabase } from '../lib/supabaseClient';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data) {
        setClients(data);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = async (name: string): Promise<Client | null> => {
    try {
      // Verifica se já existe (opcional, pois o banco tem unique constraint, mas ajuda na UX)
      const exists = clients.some(c => c.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        alert('Este cliente já está cadastrado.');
        return null;
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;

      await fetchClients(); // Atualiza a lista
      return data;
    } catch (error: any) {
      console.error("Erro ao adicionar cliente:", error);
      alert("Erro ao adicionar cliente. Verifique se o nome já existe.");
      return null;
    }
  };

  return { clients, addClient, loading, refreshClients: fetchClients };
};
