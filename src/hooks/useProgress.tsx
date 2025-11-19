import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProgressContextType {
  completedModules: number[];
  markModuleComplete: (moduleId: number) => void;
  isModuleComplete: (moduleId: number) => boolean;
  getProgressPercentage: () => number;
  enrollmentDate: string | null;
  canAccessBonus: () => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const TOTAL_MODULES = 4;
const DAYS_TO_UNLOCK_BONUS = 7;

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [enrollmentDate, setEnrollmentDate] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('panetone_progress');
    const enrollment = localStorage.getItem('panetone_enrollment_date');
    
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
    
    if (!enrollment) {
      const today = new Date().toISOString();
      localStorage.setItem('panetone_enrollment_date', today);
      setEnrollmentDate(today);
    } else {
      setEnrollmentDate(enrollment);
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
    const enrollment = new Date(enrollmentDate);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - enrollment.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= DAYS_TO_UNLOCK_BONUS;
  };

  return (
    <ProgressContext.Provider value={{
      completedModules,
      markModuleComplete,
      isModuleComplete,
      getProgressPercentage,
      enrollmentDate,
      canAccessBonus,
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
