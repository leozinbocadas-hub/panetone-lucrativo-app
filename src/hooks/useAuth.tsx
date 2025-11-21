import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Usuario } from '@/lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: Usuario | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const userSession = localStorage.getItem('user_session');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Tentando login com:', email);
      
      // Buscar usuário na tabela usuarios
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('is_active', true);

      console.log('Resposta do Supabase:', { usuarios, error });

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        return { success: false, error: 'Erro ao buscar usuário' };
      }

      if (!usuarios || usuarios.length === 0) {
        console.error('Usuário não encontrado');
        return { success: false, error: 'Email ou senha inválidos' };
      }

      const usuario = usuarios[0];

      // Comparar senha em texto plano
      console.log('Comparando senhas...');
      if (usuario.password_hash === password) {
        console.log('Login bem-sucedido!');
        // Login OK - salvar sessão
        localStorage.setItem('user_session', JSON.stringify(usuario));
        setUser(usuario);
        setIsAuthenticated(true);
        return { success: true };
      }

      console.error('Senha incorreta');
      return { success: false, error: 'Email ou senha inválidos' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    // Função placeholder - você pode implementar recuperação de senha depois
    return { success: false, error: 'Funcionalidade de recuperação de senha em desenvolvimento' };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, resetPassword }}>
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
