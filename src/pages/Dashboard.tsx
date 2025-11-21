import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LogOut, BookOpen, Video, FileText, Download, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import panetonelogo from '@/assets/panetone-logo.png';

const Dashboard = () => {
  const { logout } = useAuth();
  const { getProgressPercentage, isModuleComplete, canAccessBonus, enrollmentDate } = useProgress();
  const navigate = useNavigate();
  const progressPercentage = getProgressPercentage();
  const bonusUnlocked = canAccessBonus();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getDaysUntilBonus = () => {
    const savedSession = localStorage.getItem('user_session');
    if (!savedSession) return 7;
    
    try {
      const usuario = JSON.parse(savedSession);
      if (!usuario.created_at) return 7;
      
      const compra = new Date(usuario.created_at);
      const now = new Date();
      const daysPassed = Math.floor((now.getTime() - compra.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, 7 - daysPassed);
    } catch (error) {
      return 7;
    }
  };

  const modules = [
    {
      id: 1,
      title: 'Começando do Zero',
      description: 'Panetones que Vendem',
      icon: BookOpen,
      lessons: '5 aulas',
    },
    {
      id: 2,
      title: 'Produção Profissional',
      description: 'sem Complicação',
      icon: FileText,
      lessons: '5 aulas',
    },
    {
      id: 3,
      title: 'Marketing e Vendas',
      description: 'para Bombar no Natal',
      icon: Video,
      lessons: '5 aulas',
    },
    {
      id: 4,
      title: 'Aumentar Produção',
      description: 'e Multiplicar Lucros',
      icon: Download,
      lessons: '5 aulas',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile Optimized */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={panetonelogo} 
                alt="Panetone Lucrativo" 
                className="h-10 sm:h-12 w-auto"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Progress Card - Mobile First */}
        <Card className="mb-6 sm:mb-8 border-primary/20 bg-gradient-to-br from-card to-accent/30">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl mb-1">Seu Progresso</CardTitle>
                <CardDescription className="text-sm">
                  {progressPercentage}% concluído
                </CardDescription>
              </div>
              <Badge variant="secondary" className="shrink-0 font-bold">
                {modules.filter(m => isModuleComplete(m.id)).length}/{modules.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Bem-vindo(a)! 👋
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Continue aprendendo e construindo seu negócio de panetones
          </p>
        </div>

        {/* Modules Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {modules.map((module) => {
            const Icon = module.icon;
            const completed = isModuleComplete(module.id);
            
            return (
              <Card
                key={module.id}
                onClick={() => navigate(`/module/${module.id}`)}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden active:scale-[0.98]"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      completed 
                        ? 'bg-success/10 text-success' 
                        : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                    } transition-all duration-300`}>
                      {completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base sm:text-lg">
                          Módulo {module.id}
                        </CardTitle>
                        {completed && (
                          <Badge variant="outline" className="text-success border-success">
                            Completo
                          </Badge>
                        )}
                      </div>
                      <p className="font-semibold text-foreground text-sm sm:text-base mb-1">
                        {module.title}
                      </p>
                      <CardDescription className="text-xs sm:text-sm line-clamp-2">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{module.lessons}</span>
                    <Button 
                      size="sm" 
                      variant={completed ? "outline" : "default"}
                      className="gap-2"
                    >
                      {completed ? 'Revisar' : 'Acessar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bonus Section - Mobile First */}
        <Card 
          className={`${
            bonusUnlocked 
              ? 'border-secondary/50 bg-gradient-to-br from-card to-secondary/10 cursor-pointer hover:shadow-lg' 
              : 'border-muted bg-muted/30'
          } relative overflow-hidden transition-all duration-300`}
          onClick={() => bonusUnlocked && navigate('/module/5')}
        >
          {!bonusUnlocked && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center px-4">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-foreground text-sm sm:text-base mb-1">
                  Bloqueado por {getDaysUntilBonus()} {getDaysUntilBonus() === 1 ? 'dia' : 'dias'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Complete os módulos e aguarde 7 dias
                </p>
              </div>
            </div>
          )}
          
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                bonusUnlocked ? 'bg-secondary/20' : 'bg-muted'
              }`}>
                <Download className={`w-6 h-6 ${bonusUnlocked ? 'text-secondary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl mb-2 flex items-center gap-2 flex-wrap">
                  📓 Módulo 5: Estratégias Secretas
                  {bonusUnlocked && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      Disponível
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  para Vender Muito Mais
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          {bonusUnlocked && (
            <CardContent>
              <Button className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold gap-2">
                <Download className="w-4 h-4" />
                Acessar Bônus
              </Button>
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
