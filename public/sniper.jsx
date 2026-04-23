import React, { useState, useEffect } from 'react';
import { Crosshair, Radar, Activity, Zap, History, ShieldAlert, CheckCircle2, ChevronRight, Lock, Server, Plane } from 'lucide-react';

// --- CUSTOM STYLES & ANIMATIONS ---
// Estética "Elite Betting Terminal": Profundidade tátil, brilho volumétrico, e realismo de hardware.
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;700;800&display=swap');

  :root {
    --green-neon: #00ff88;
    --green-glow: rgba(0, 255, 136, 0.4);
    --red-crash: #ff2a5f;
    --aviator-blue: #00d2ff;
    --aviator-purple: #b052ff;
    --aviator-pink: #ff007a;
    --bg-carbon: #030303;
    --panel-bg: rgba(10, 10, 10, 0.6);
    --glass-border: rgba(255, 255, 255, 0.08);
  }

  body {
    background-color: var(--bg-carbon);
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .font-mono {
    font-family: 'JetBrains Mono', monospace;
  }

  /* Física e Inércia Aprimoradas */
  .tactic-button {
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .tactic-button:active {
    transform: scale(0.96) translateY(2px);
  }

  /* Glassmorphism Premium com Borda Iluminada */
  .glass-panel {
    background: var(--panel-bg);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--glass-border);
    box-shadow: 
      inset 0 1px 0 rgba(255,255,255,0.1),
      0 20px 40px -10px rgba(0,0,0,0.8);
  }

  /* Efeito de Hardware / Monitor CRT no Radar */
  .hardware-screen {
    position: relative;
    background: radial-gradient(circle at center, #0a0a0a 0%, #000000 100%);
    box-shadow: inset 0 0 40px rgba(0,0,0,0.9);
    overflow: hidden;
  }
  
  .hardware-screen::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 2;
    background-size: 100% 4px, 6px 100%;
    pointer-events: none;
  }

  /* Simulação Balística do Avião */
  @keyframes flyUp {
    0% { left: -5%; bottom: -5%; transform: scale(0.8) rotate(0deg); opacity: 0; }
    10% { left: 5%; bottom: 0%; transform: scale(1) rotate(0deg); opacity: 1; }
    85% { left: 80%; bottom: 70%; transform: scale(1.6) rotate(-22deg); opacity: 1; }
    100% { left: 80%; bottom: 70%; transform: scale(1.6) rotate(-22deg); opacity: 0; }
  }

  .aviator-plane-container {
    position: absolute;
    animation: flyUp 3.5s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
    transform-origin: center center;
    z-index: 20;
  }

  @keyframes pulseRadar {
    0% { transform: scale(0.5); opacity: 0.8; border-width: 2px; }
    100% { transform: scale(3); opacity: 0; border-width: 1px; }
  }

  .radar-ring {
    position: absolute;
    border-radius: 50%;
    border: solid var(--green-neon);
    animation: pulseRadar 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
  }

  @keyframes textGlow {
    0%, 100% { text-shadow: 0 0 15px rgba(255, 255, 255, 0.1); }
    50% { text-shadow: 0 0 30px rgba(255, 255, 255, 0.6); }
  }
  
  .glowing-text {
    animation: textGlow 3s ease-in-out infinite;
  }

  /* Botão de Ação Agressivo com Glow Volumétrico */
  @keyframes buttonPulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(0, 255, 136, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
  }

  .btn-green-neon {
    background: linear-gradient(135deg, var(--green-neon) 0%, #00cc6a 100%);
    color: #000;
    box-shadow: 0 10px 20px -5px var(--green-glow);
    text-shadow: 0 1px 1px rgba(255,255,255,0.4);
    animation: buttonPulse 2.5s infinite;
  }
  .btn-green-neon:hover {
    background: #ffffff;
    color: #000;
    box-shadow: 0 0 40px var(--green-glow), 0 0 15px rgba(255,255,255,0.8);
    animation: none;
  }

  /* Dinâmica de Fumaça Volumétrica (Atmosphere) */
  @keyframes smokeFlow {
    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.2; }
    33% { transform: translate(5vw, -5vh) scale(1.1) rotate(5deg); opacity: 0.4; }
    66% { transform: translate(-5vw, 5vh) scale(0.9) rotate(-5deg); opacity: 0.15; }
    100% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.2; }
  }
  
  .smoke-particle {
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    z-index: 0;
    animation: smokeFlow 30s infinite cubic-bezier(0.4, 0, 0.2, 1);
    mix-blend-mode: screen;
  }
  
  .smoke-1 { 
    background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%); 
    width: 80vw; height: 80vh; top: -10vh; left: -20vw; 
    animation-duration: 45s; 
  }
  .smoke-2 { 
    background: radial-gradient(circle, rgba(0,255,136,0.02) 0%, transparent 70%); 
    width: 90vw; height: 90vh; bottom: -20vh; right: -20vw; 
    animation-duration: 55s; animation-delay: -15s; 
  }
  .smoke-3 { 
    background: radial-gradient(circle, rgba(0,210,255,0.02) 0%, transparent 70%); 
    width: 100vw; height: 100vh; top: 15vh; left: 10vw; 
    animation-duration: 65s; animation-delay: -25s; 
  }

  /* Elasticidade de Scroll */
  html { overscroll-behavior-y: none; }
`;

// Helper para cores das velas (Padrão Aviator refinado)
const getMultiplierColor = (value) => {
  if (value < 2.0) return 'text-[var(--aviator-blue)] border-[var(--aviator-blue)]/30 bg-[var(--aviator-blue)]/10 shadow-[0_0_10px_rgba(0,210,255,0.1)]'; 
  if (value < 10.0) return 'text-[var(--aviator-purple)] border-[var(--aviator-purple)]/40 bg-[var(--aviator-purple)]/15 shadow-[0_0_15px_rgba(176,82,255,0.2)]'; 
  return 'text-[var(--aviator-pink)] border-[var(--aviator-pink)]/50 bg-[var(--aviator-pink)]/20 shadow-[0_0_20px_rgba(255,0,122,0.3)]'; 
};

export default function App() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [status, setStatus] = useState('scanning'); // scanning, signal, flying
  const [history, setHistory] = useState([1.12, 2.45, 1.05, 14.20, 1.85]);

  // Simulação de comportamento de leitor de sinais
  useEffect(() => {
    let interval;
    if (status === 'flying') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const next = prev + 0.03;
          if (next > 2.50) {
            setStatus('scanning');
            setHistory(h => [parseFloat(next.toFixed(2)), ...h.slice(0, 4)]);
            return 1.00;
          }
          return next;
        });
      }, 50);
    } else if (status === 'scanning') {
      setTimeout(() => setStatus('signal'), 2200);
    } else if (status === 'signal') {
      setTimeout(() => setStatus('flying'), 1800);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="min-h-screen bg-[var(--bg-carbon)] text-slate-200 selection:bg-[#00ff88]/30 selection:text-white relative">
      <style>{globalStyles}</style>

      {/* Ruído Sutil no Background inteiro para textura */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      {/* Fumaça Volumétrica (Deep Layer) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="smoke-particle smoke-1"></div>
        <div className="smoke-particle smoke-2"></div>
        <div className="smoke-particle smoke-3"></div>
      </div>

      {/* --- HERO SECTION: MOCKUP & COPY --- */}
      <header className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden px-4 md:px-8 pt-24 pb-16">
        
        {/* Ambient Light Orbs - O Vazio estratégico iluminado */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--green-neon)]/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--aviator-blue)]/10 blur-[180px] rounded-full pointer-events-none"></div>
        
        {/* Grid Background Tático Ultra Fino */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center">
          
          {/* LADO ESQUERDO: Texto de Conversão */}
          <div className="flex flex-col items-start text-left order-2 lg:order-1 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--green-neon)]/10 border border-[var(--green-neon)]/20 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,136,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green-neon)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--green-neon)]"></span>
              </span>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[var(--green-neon)] uppercase font-mono">Status: API Conectada • 12 Vagas</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
              O RADAR QUE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--green-neon)] to-[var(--aviator-blue)] drop-shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                PREVÊ O CRASH.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-xl mb-12 font-light leading-relaxed">
              Transforme seu dispositivo num terminal de operações de elite. Algoritmo avançado conectado via <strong className="text-white font-medium">WebSockets</strong> que lê as chaves criptográficas da Spribe milissegundos antes da decolagem.
            </p>

            <button className="w-full sm:w-auto tactic-button btn-green-neon px-12 py-5 rounded-xl text-lg font-black tracking-widest flex items-center justify-center gap-3 uppercase">
              Desbloquear Acesso VIP
              <Crosshair className="w-6 h-6" />
            </button>
            
            <div className="mt-8 flex items-center gap-6 text-xs font-mono text-slate-500 tracking-wider">
              <span className="flex items-center gap-1.5"><Server className="w-4 h-4 text-[var(--green-neon)]"/> PING: <span className="text-white">12ms</span></span>
              <span className="opacity-30">/</span>
              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-[var(--aviator-blue)]"/> UPTIME: <span className="text-white">99.9%</span></span>
            </div>
          </div>

          {/* LADO DIREITO: Mockup do Leitor de Sinais (A "Cara de Bot") */}
          <div className="order-1 lg:order-2 flex justify-center w-full relative">
            {/* Brilho Intenso atrás do Monitor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[var(--green-neon)]/15 blur-[120px] rounded-full pointer-events-none"></div>
            
            {/* O Painel do Radar */}
            <div className="glass-panel w-full max-w-[480px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative z-10 flex flex-col">
              
              {/* Header do Bot */}
              <div className="bg-black/60 px-6 py-4 border-b border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <Radar className="w-5 h-5 text-[var(--green-neon)]" />
                  <span className="font-mono font-bold text-sm tracking-widest text-slate-200">SNIPER_CORE_V2</span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${status === 'signal' ? 'bg-[var(--green-neon)] animate-pulse shadow-[0_0_10px_#00ff88]' : status === 'scanning' ? 'bg-[var(--aviator-blue)]' : 'bg-slate-500'}`}></div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-300">
                    {status === 'scanning' ? 'Analisando Seed' : status === 'signal' ? 'Sinal Extraído' : 'Em Rota'}
                  </span>
                </div>
              </div>

              {/* Área do Multiplicador Principal (A Tela de Hardware) */}
              <div className="hardware-screen p-8 flex flex-col items-center justify-center min-h-[280px]">
                
                {status === 'scanning' && (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <div className="radar-ring w-32 h-32 opacity-60"></div>
                    <div className="radar-ring w-32 h-32" style={{ animationDelay: '1.25s' }}></div>
                    <Plane className="w-14 h-14 text-[var(--green-neon)]/60 fill-[var(--green-neon)]/10 relative z-10 transform -rotate-45 animate-pulse drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]" />
                    <div className="absolute -bottom-8 font-mono text-xs text-[var(--green-neon)]/60 tracking-[0.3em] uppercase">Buscando Padrão</div>
                  </div>
                )}
                
                {status === 'signal' && (
                  <div className="text-center animate-in fade-in zoom-in duration-200 relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-[var(--green-neon)]/10 border border-[var(--green-neon)]/50 rounded text-[var(--green-neon)] font-mono font-bold text-sm shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                      <Zap className="w-4 h-4 fill-[var(--green-neon)]" /> ENTRADA CONFIRMADA
                    </div>
                    <div className="font-mono text-6xl font-black text-white mb-2 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] glowing-text">
                      SAIR EM <span className="text-[var(--green-neon)]">1.50x</span>
                    </div>
                    <div className="text-slate-400 mt-2 text-xs font-mono tracking-widest bg-black/40 px-3 py-1 rounded">MÉDIA DE SEGURANÇA: 2.00x</div>
                  </div>
                )}

                {status === 'flying' && (
                  <div className="text-center w-full relative z-10 flex flex-col items-center justify-center h-full">
                    {/* Linha do Gráfico Aviator com Avião */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-80 pointer-events-none">
                       
                       {/* O Veículo Balístico */}
                       <div className="aviator-plane-container flex items-center justify-center drop-shadow-[0_0_25px_var(--aviator-purple)]">
                         {/* Rastro Térmico / Fumaça de Propulsão */}
                         <div className="absolute right-[70%] top-1/2 w-28 h-1.5 bg-gradient-to-r from-transparent via-[var(--aviator-purple)] to-white blur-[3px] opacity-90 transform -translate-y-1/2"></div>
                         
                         {/* Fuselagem */}
                         <Plane className="w-10 h-10 text-white fill-white transform rotate-45 relative z-10" />
                       </div>

                       <svg className="absolute bottom-4 left-0 w-full h-[80%]" preserveAspectRatio="none" viewBox="0 0 100 100">
                         <path d="M-10,100 Q40,90 100,-10" fill="none" stroke="url(#gradient-line)" strokeWidth="3" strokeDasharray="4 6" />
                         <defs>
                           <linearGradient id="gradient-line" x1="0%" y1="100%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="var(--aviator-blue)" />
                             <stop offset="100%" stopColor="var(--aviator-purple)" />
                           </linearGradient>
                         </defs>
                       </svg>
                    </div>

                    <div className={`relative z-20 font-mono text-8xl font-black tracking-tighter ${multiplier >= 2.0 ? 'text-[var(--aviator-purple)] drop-shadow-[0_0_40px_rgba(176,82,255,0.5)]' : 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}>
                      {multiplier.toFixed(2)}x
                    </div>
                  </div>
                )}
              </div>

              {/* Histórico de Velas */}
              <div className="bg-black/80 px-6 py-5 border-t border-white/5 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Histórico de Hash</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                </div>
                <div className="flex gap-3 overflow-hidden">
                  {history.map((val, i) => (
                    <div key={i} className={`flex-1 flex justify-center items-center py-2 rounded border font-mono text-sm font-black ${getMultiplierColor(val)}`}>
                      {val.toFixed(2)}x
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* --- RECURSOS TÉCNICOS: O PODER ESTRATÉGICO --- */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="text-center mb-20">
          <div className="inline-flex px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 font-mono">Arquitetura do Sistema</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">Tecnologia de <span className="text-[var(--green-neon)]">Extração</span></h2>
          <p className="text-slate-400 font-mono mt-4 text-sm tracking-wider">A matemática probabilística rodando no background.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'Latência Zero', text: 'Servidores dedicados interceptam o sinal no exato milissegundo em que a seed é gerada. Esqueça delays de grupos de Telegram.' },
            { icon: Crosshair, title: 'Caçador de Rosas', text: 'O algoritmo identifica a saturação de velas azuis/roxas e alerta matematicamente a janela para buscar multiplicadores 10.00x+.' },
            { icon: Activity, title: 'Cálculo de Recuperação', text: 'A calculadora de Martingale integrada indica exatamente a fração de banca necessária para a próxima entrada cobrir o risco e gerar lucro.' }
          ].map((feat, idx) => (
            <div key={idx} className="glass-panel p-10 rounded-2xl flex flex-col items-start border-t-2 border-t-[var(--green-neon)] hover:bg-white/[0.03] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,255,136,0.1)] group">
              <div className="p-4 rounded-xl bg-[var(--green-neon)]/10 mb-8 group-hover:scale-110 transition-transform duration-500">
                <feat.icon className="w-8 h-8 text-[var(--green-neon)]" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">{feat.title}</h4>
              <p className="text-sm text-slate-400 font-light leading-relaxed">{feat.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER & AVISO DE RISCO --- */}
      <footer className="bg-[#000000] py-16 px-6 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-black tracking-tighter text-white mb-6 uppercase flex items-center gap-3">
              <Radar className="w-8 h-8 text-[var(--green-neon)]"/> AVIATOR<span className="text-[var(--green-neon)]">_SNIPER</span>
            </h2>
            <div className="flex items-start gap-4 p-5 bg-[var(--red-crash)]/5 border border-[var(--red-crash)]/20 rounded-xl text-slate-400 text-[11px] font-mono leading-relaxed shadow-[inset_0_0_20px_rgba(255,42,95,0.02)]">
              <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5 text-[var(--red-crash)]" />
              <p>
                <strong className="text-[var(--red-crash)]">AVISO DE RISCO SEVERO:</strong> O uso de inteligência artificial mitigadora não anula a variância matemática de algoritmos "Provably Fair" (RNG). Este sistema é uma ferramenta de probabilidade, não uma garantia de lucro infalível. Opere com extremo rigor no gerenciamento de banca. Não arrisque capital destinado a despesas vitais. Proibido para menores de 18 anos.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-xs font-mono tracking-widest text-slate-500 uppercase mt-2">
            <a href="#" className="hover:text-[var(--green-neon)] transition-colors py-1">Política de Privacidade</a>
            <a href="#" className="hover:text-[var(--green-neon)] transition-colors py-1">Termos de Responsabilidade</a>
            <a href="#" className="hover:text-white transition-colors py-1 flex items-center gap-2 mt-4 text-[var(--green-neon)] font-bold">
              <Lock className="w-4 h-4"/> Acesso Área VIP
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center font-mono text-[10px] text-slate-600 tracking-widest">
          &copy; {new Date().getFullYear()} SNIPER TECH. ALL SYSTEMS OPERATIONAL.
        </div>
      </footer>
    </div>
  );
}