import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, type Member } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  member: Member | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão local
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      try {
        const usuario = JSON.parse(savedSession);
        setUser({ id: usuario.id, email: usuario.email } as User);
        setMember(usuario);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        localStorage.removeItem('user_session');
      }
    }
    setLoading(false);
  }, []);

  const fetchMemberData = async (userId: string) => {
    try {
      // Buscar email do usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        console.error('No user email found');
        return;
      }

      // Buscar dados na tabela usuarios usando o email
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', user.email)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching member data:', error);
        return;
      }

      setMember(data);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Buscar usuário na tabela usuarios
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error || !usuario) {
        return { success: false, error: 'Email ou senha inválidos' };
      }

      // Comparar senha em texto plano
      if (usuario.password_hash !== password) {
        return { success: false, error: 'Email ou senha inválidos' };
      }

      // Criar sessão local
      setUser({ id: usuario.id, email: usuario.email } as User);
      setMember(usuario);
      setIsAuthenticated(true);
      localStorage.setItem('user_session', JSON.stringify(usuario));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao fazer login' };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setMember(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user_session');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/auth?reset=true`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao enviar email de recuperação' };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, member, login, logout, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
