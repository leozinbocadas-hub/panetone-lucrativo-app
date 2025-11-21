import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eeawnigrumhtxjcgxgvy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlYXduaWdydW1odHhqY2d4Z3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODEyNzIsImV4cCI6MjA3OTI1NzI3Mn0.74P0Zj54GtdKtFfoYGLqMw_8ZgRSY9sQum6Q06Nd0Aw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type Member = {
  id: string;
  email: string;
  password_hash: string;
  purchase_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  nome_exibicao: string | null;
};
