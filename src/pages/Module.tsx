import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, FileText, Download, Eye, X } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Module = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const moduleId = parseInt(id || '1');
  const [viewingPdf, setViewingPdf] = useState<{ title: string; url: string; index: number } | null>(null);
  const { markModuleComplete, isModuleComplete } = useProgress();
  const { toast } = useToast();

  // Função para converter URL do Google Drive para embed
  const getEmbedUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([^/]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url;
  };

  // Função para obter URL de download
  const getDownloadUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([^/]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
    return url;
  };

  const handleViewPdf = (pdf: { title: string; url: string }, index: number) => {
    setViewingPdf({ ...pdf, index });
  };
  
  const modules = [
    { 
      id: 1, 
      title: '📘 MÓDULO 1 — Começando do Zero: Panetones que Vendem', 
      totalPages: 5, 
      pdfs: [
        { title: 'Panetone Lucrativo – Guia Oficial', url: 'https://drive.google.com/file/d/1GjgDM3tJdYBUZ4p6t_tmrV5eUBdl3fqm/view?usp=sharing' },
        { title: 'Receitas Premium de Panetone Artesanal', url: 'https://drive.google.com/file/d/1GjgDM3tJdYBUZ4p6t_tmrV5eUBdl3fqm/view?usp=sharing' },
        { title: 'Guia de Precificação e Lucro', url: 'https://drive.google.com/file/d/1iqNmds28FmQj_oFGyw17-I693RyqKNoh/view?usp=sharing' },
        { title: 'Estratégia de Vendas no WhatsApp', url: 'https://drive.google.com/file/d/1xtRFd45FzJHw9v6e2ohGvwdQXIkwy1hr/view?usp=sharing' },
        { title: 'Embalagens, Branding e Apresentação', url: 'https://drive.google.com/file/d/1W2y2rRtj9vSVwOwsnIbrAPx4MSvRRuPd/view?usp=sharing' },
      ]
    },
    { 
      id: 2, 
      title: '📕 MÓDULO 2 — Produção Profissional sem Complicação', 
      totalPages: 5, 
      pdfs: [
        { title: 'Padronização Profissional dos Panetones', url: 'https://drive.google.com/file/d/1RdxHpKN6cqB1C_tnWGvhplHCd-B-Y_9Q/view?usp=sharing' },
        { title: 'Máquinas, Equipamentos e Ferramentas Essenciais', url: 'https://drive.google.com/file/d/1s086ajo3u6ltHo1K_e34hBWs9zjk8ZLr/view?usp=sharing' },
        { title: 'Checklists de Produção, Estoque e Entrega', url: 'https://drive.google.com/file/d/1mrgFZS7ZR1V51t37OKBH83lcSDS51u-k/view?usp=sharing' },
        { title: 'Calendário de Produção e Vendas do Natal', url: 'https://drive.google.com/file/d/1SkQdrWakEkY6Jf9-f6pNVFn038_Jv-yi/view?usp=sharing' },
        { title: 'Catálogo de Sabores e Combos para Vender', url: 'https://drive.google.com/file/d/11KvzUlpflXGmvhCTY-shFXc5vMUBm9Ab/view?usp=sharing' },
      ]
    },
    { 
      id: 3, 
      title: '📙 MÓDULO 3 — Marketing e Vendas para Bombar no Natal', 
      totalPages: 5, 
      pdfs: [
        { title: 'Branding & Identidade de Luxo para Panetones', url: 'https://drive.google.com/file/d/1wtnTj4w6Zc9TOX9bl4f_EaESs7m8kemk/view?usp=sharing' },
        { title: 'Copywriting de Natal – Textos que Vendem Panetones', url: 'https://drive.google.com/file/d/1xwej800wvLIoB1jhCzi2NqxT4X9OPOI3/view?usp=sharing' },
        { title: 'Guia de Conteúdo para Viralizar no Instagram', url: 'https://drive.google.com/file/d/1F3pA6SDJ006TEcXeWcKQYrc31baTVWj9/view?usp=sharing' },
        { title: 'Manual Completo de Anúncios para Panetones', url: 'https://drive.google.com/file/d/1LGAckMIO9jtwxL6K57K8TMYdYgzGS7iP/view?usp=sharing' },
        { title: 'Entrega, Logística e Embalagem Profissional', url: 'https://drive.google.com/file/d/1lp-fFgIyeFcZRd2w1L5XduA-2KKTO4_-/view?usp=sharing' },
      ]
    },
    { 
      id: 4, 
      title: '📗 MÓDULO 4 — Como Aumentar Produção e Multiplicar Lucros', 
      totalPages: 5, 
      pdfs: [
        { title: 'Escala Inteligente: Como Produzir Mais Sem Perder Qualidade', url: 'https://drive.google.com/file/d/1DAKxnm1Bpvz7EBzgaE6_il6MM6t0igCi/view?usp=sharing' },
        { title: 'Automação de Vendas – Do Status ao Caixa', url: 'https://drive.google.com/file/d/1yBVbC2wF1rnOoLEw2rbScaQydfsbzjrP/view?usp=sharing' },
        { title: 'LTV & Recorrência – Fazendo o Cliente Comprar 2, 3, 4 Vezes', url: 'https://drive.google.com/file/d/1B-9ANvTYaCeCtlNlYYb_AwMhQNdsl01-/view?usp=sharing' },
        { title: 'Gestão Financeira Simples para Panetones', url: 'https://drive.google.com/file/d/1ynA-FCxKcDP5zz_B51lHD5J_d_AsxUZD/view?usp=sharing' },
        { title: 'Escala de Equipe, Parcerias e Terceirização Inteligente', url: 'https://drive.google.com/file/d/1gZRT_Tmc3Wev5WnILgzoTgz971uTwK9_/view?usp=sharing' },
      ]
    },
    { 
      id: 5, 
      title: '📓 MÓDULO 5 — Estratégias Secretas para Vender Muito Mais', 
      totalPages: 5, 
      isBonus: true,
      pdfs: [
        { title: 'A Oferta Suprema de Natal', url: 'https://drive.google.com/file/d/1uH9DTUsa9Sm_pt3yAfmxiqdQtpZgAv34/view?usp=sharing' },
        { title: 'Efeito Viral: Como Fazer seus Panetones Espalharem como Fogo', url: 'https://drive.google.com/file/d/11uRjezUy0LGH8OaukNME8zRCDHepUqNm/view?usp=sharing' },
        { title: 'Ads Avançado: Criativos Profissionais que Vendem Muito no Natal', url: 'https://drive.google.com/file/d/14HLQF54HIVgp3rNVNpskfXcw-FU0Ln7H/view?usp=sharing' },
        { title: 'O Método X1 Aristocrata – Vendendo sem Parecer Vendedor', url: 'https://drive.google.com/file/d/1ATHgEOY6Q-XDpxFmotl17j2HiaNfe_jm/view?usp=sharing' },
        { title: 'Efeito Cliente Ouro – Criando Fãs que Compram Todo Ano', url: 'https://drive.google.com/file/d/1vv34-RC1Jkg9dlFoBJ0qegK5uHPxiX2p/view?usp=sharing' },
      ]
    },
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
                {module.pdfs.length} {module.isBonus ? 'materiais' : 'aulas'} disponíveis
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-muted/30">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">{module.title}</CardTitle>
              <CardDescription>
                {module.pdfs.length} {module.isBonus ? 'materiais bônus' : 'aulas'} disponíveis
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {module.pdfs.map((pdf, index) => (
              <Card key={`${moduleId}-${index}`} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">
                          {pdf.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Conteúdo Premium
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => handleViewPdf(pdf, index)}
                        variant="outline"
                        className="gap-2 flex-1 sm:flex-initial"
                        size="sm"
                      >
                        <Eye className="w-4 h-4" />
                        Visualizar
                      </Button>
                      <Button
                        onClick={() => window.open(getDownloadUrl(pdf.url), '_blank')}
                        className="gap-2 flex-1 sm:flex-initial bg-primary hover:bg-primary/90"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="fixed inset-0 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-card/95 backdrop-blur">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold truncate">
                  {viewingPdf.title}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewingPdf(null)}
                className="shrink-0 hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 bg-muted/30">
              <iframe
                src={getEmbedUrl(viewingPdf.url)}
                className="w-full h-full border-0"
                title={viewingPdf.title}
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Module;
