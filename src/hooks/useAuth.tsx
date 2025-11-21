import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Usuario } from '@/lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: Usuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentando login com:', email);
      
      // Buscar usuário na tabela usuarios
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('is_active', true);

      console.log('Resposta do Supabase:', { usuarios, error });

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        return false;
      }

      if (!usuarios || usuarios.length === 0) {
        console.error('Usuário não encontrado');
        return false;
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
        return true;
      }

      console.error('Senha incorreta');
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
