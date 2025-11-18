
import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANTE: Substitua as strings abaixo pelas suas chaves do Supabase
// Você encontra elas em Project Settings -> API no painel do Supabase
const SUPABASE_URL = 'https://zjwqkjyjgqihzummyxbu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd3FranlqZ3FpaHp1bW15eGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjQ0NDUsImV4cCI6MjA3OTA0MDQ0NX0.l2vWKoDPSBBiXTxuG4Azv4NbXGb5JfAy8cQ9OzbdYeA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
