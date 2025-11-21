import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProgressContextType {
  completedModules: number[];
  markModuleComplete: (moduleId: number) => void;
  isModuleComplete: (moduleId: number) => boolean;
  getProgressPercentage: () => number;
  enrollmentDate: string | null;
  canAccessBonus: () => boolean;
  getDaysUntilBonus: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const TOTAL_MODULES = 4;
const DAYS_TO_UNLOCK_BONUS = 7;

// Função para calcular dias desde a compra
const calcularDias = (created_at: string): number => {
  const compra = new Date(created_at);
  const hoje = new Date();
  return Math.floor((hoje.getTime() - compra.getTime()) / (1000 * 60 * 60 * 24));
};

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [enrollmentDate, setEnrollmentDate] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('panetone_progress');
    const userSession = localStorage.getItem('user_session');
    
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
    
    // Usar created_at do usuário como data de matrícula
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        setEnrollmentDate(userData.created_at);
      } catch (error) {
        console.error('Erro ao carregar data de matrícula:', error);
      }
    }
  }, []);

  const markModuleComplete = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      const updated = [...completedModules, moduleId];
      setCompletedModules(updated);
      localStorage.setItem('panetone_progress', JSON.stringify(updated));
    }
  };

  const isModuleComplete = (moduleId: number) => {
    return completedModules.includes(moduleId);
  };

  const getProgressPercentage = () => {
    return Math.round((completedModules.length / TOTAL_MODULES) * 100);
  };

  const canAccessBonus = () => {
    if (!enrollmentDate) return false;
    return calcularDias(enrollmentDate) >= DAYS_TO_UNLOCK_BONUS;
  };

  const getDaysUntilBonus = () => {
    if (!enrollmentDate) return DAYS_TO_UNLOCK_BONUS;
    const diasPassados = calcularDias(enrollmentDate);
    return Math.max(0, DAYS_TO_UNLOCK_BONUS - diasPassados);
  };

  return (
    <ProgressContext.Provider value={{
      completedModules,
      markModuleComplete,
      isModuleComplete,
      getProgressPercentage,
      enrollmentDate,
      canAccessBonus,
      getDaysUntilBonus,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
