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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // Defer member data fetching
        if (session?.user) {
          setTimeout(() => {
            fetchMemberData(session.user.id);
          }, 0);
        } else {
          setMember(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        fetchMemberData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao fazer login' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setMember(null);
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
