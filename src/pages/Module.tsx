import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const Module = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const moduleId = parseInt(id || '1');
  const [currentPage, setCurrentPage] = useState(1);
  const { markModuleComplete, isModuleComplete } = useProgress();
  const { toast } = useToast();
  
  const modules = [
    { id: 1, title: 'Módulo 1: Introdução', totalPages: 5, pdfUrl: '/sample.pdf' },
    { id: 2, title: 'Módulo 2: Receitas', totalPages: 8, pdfUrl: '/sample.pdf' },
    { id: 3, title: 'Módulo 3: Marketing', totalPages: 6, pdfUrl: '/sample.pdf' },
    { id: 4, title: 'Módulo 4: Recursos', totalPages: 4, pdfUrl: '/sample.pdf' },
  ];

  const module = modules.find(m => m.id === moduleId);
  if (!module) return null;

  const isComplete = isModuleComplete(moduleId);

  const handleComplete = () => {
    markModuleComplete(moduleId);
    
    // Som de celebração
    const audio = new Audio('/sounds/celebration.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Erro ao tocar som:', err));
    
    // Animação de confetes
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
    
    toast({
      title: "Módulo concluído! 🎉",
      description: "Continue progredindo no curso.",
    });
  };

  const nextPage = () => {
    if (currentPage < module.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Mobile-First */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">
                {module.title}
              </h1>
              <p className="text-xs text-muted-foreground">
                Página {currentPage} de {module.totalPages}
              </p>
            </div>

            {!isComplete && (
              <Button
                onClick={handleComplete}
                size="sm"
                className="gap-2 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Concluir</span>
              </Button>
            )}
            {isComplete && (
              <div className="flex items-center gap-2 text-success shrink-0">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Completo</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* PDF Viewer Area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 bg-muted/30 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-4xl bg-card rounded-lg shadow-xl overflow-hidden">
            {/* Simulação de PDF - Em produção, usar biblioteca como react-pdf */}
            <div className="aspect-[3/4] bg-white flex items-center justify-center text-center p-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">📄</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {module.title}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
                  Página {currentPage} de {module.totalPages}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  (Visualizador de PDF - Carregue seus PDFs aqui)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls - Fixed Bottom on Mobile */}
        <div className="bg-card border-t border-border sticky bottom-0 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: module.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentPage === i + 1
                        ? 'bg-primary w-6'
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextPage}
                disabled={currentPage === module.totalPages}
                variant="outline"
                className="gap-2"
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Module;
