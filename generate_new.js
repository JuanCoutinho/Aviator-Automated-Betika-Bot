const fs = require('fs');

const jsxContent = `import React, { useState, useEffect, useRef } from 'react';

const globalStyles = \`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold-0: #FFFDE7;
    --gold-1: #FFEA00;
    --gold-2: #FFD700;
    --gold-3: #DAA520;
    --bg-dark: #050505;
    --bg-card: rgba(255, 255, 255, 0.02);
    --green: #00E676;
    --red: #FF3D00;
    --font-display: 'Outfit', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  html { scroll-behavior: smooth; overflow-x: hidden; }

  body {
    background: var(--bg-dark);
    color: #E0E0E0;
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::selection {
    background: rgba(255, 215, 0, 0.2);
    color: var(--gold-2);
  }

  /* ── BACKGROUND ── */
  .bg-glow {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 100vw; height: 100vh;
    background: radial-gradient(circle at 50% 50%, rgba(218, 165, 32, 0.08) 0%, transparent 60%);
    pointer-events: none;
    z-index: -1;
  }
  .bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: -2;
    background-image:
      linear-gradient(rgba(255,215,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,215,0,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
  }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    padding: 20px 5%;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(5, 5, 5, 0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 215, 0, 0.05);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 900;
    color: white;
    display: flex; align-items: center; gap: 8px;
    letter-spacing: 0.05em;
  }
  .nav-logo-icon {
    color: var(--gold-2);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4));
  }
  .nav-btn {
    font-family: var(--font-display);
    font-size: 13px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 10px 24px; border-radius: 100px;
    background: rgba(255, 215, 0, 0.1);
    color: var(--gold-2); border: 1px solid rgba(255, 215, 0, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .nav-btn:hover {
    background: var(--gold-2); color: #000;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    transform: translateY(-2px);
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 140px 5% 80px;
    position: relative;
  }
  .hero-container {
    display: grid; grid-template-columns: 1.2fr 1fr;
    gap: 40px; align-items: center;
    max-width: 1400px; margin: 0 auto; w-full
  }
  @media (max-width: 992px) {
    .hero-container { grid-template-columns: 1fr; text-align: center; }
    .hero-text { align-items: center; }
  }

  .status-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 100px;
    background: rgba(0, 230, 118, 0.1);
    border: 1px solid rgba(0, 230, 118, 0.2);
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--green); margin-bottom: 30px;
  }
  .status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 10px var(--green);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(0, 230, 118, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 230, 118, 0); }
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(50px, 7vw, 90px);
    font-weight: 900; line-height: 0.95;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #fff; margin-bottom: 24px;
  }
  .hero-title .highlight {
    background: linear-gradient(135deg, var(--gold-0), var(--gold-2), var(--gold-3));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.2));
  }
  .hero-title .outline {
    color: transparent;
    -webkit-text-stroke: 1.5px var(--gold-2);
  }

  .hero-desc {
    font-size: 18px; line-height: 1.6;
    color: #A0A0A0; font-weight: 300;
    max-width: 500px; margin-bottom: 40px;
  }
  .hero-desc strong { color: #fff; font-weight: 500; }

  .hero-cta {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 12px; padding: 20px 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--gold-1) 0%, var(--gold-3) 100%);
    color: #000; font-family: var(--font-display);
    font-size: 16px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    text-decoration: none; border: none; cursor: pointer;
    box-shadow: 0 10px 30px -10px rgba(255, 215, 0, 0.5), inset 0 2px 0 rgba(255,255,255,0.4);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .hero-cta:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px -10px rgba(255, 215, 0, 0.7), inset 0 2px 0 rgba(255,255,255,0.4);
  }

  .trust-indicators {
    display: flex; gap: 24px; margin-top: 30px;
    font-family: var(--font-mono); font-size: 11px;
    color: #888; text-transform: uppercase;
  }
  @media (max-width: 992px) { .trust-indicators { justify-content: center; } }
  .trust-indicators span { display: flex; align-items: center; gap: 6px; }
  .trust-indicators i { color: var(--gold-2); font-style: normal; }

  /* ── PHONE VISUAL ── */
  .visual-wrapper {
    position: relative;
    display: flex; justify-content: center; align-items: center;
    perspective: 1000px;
  }
  .phone-glow {
    position: absolute; w: 100%; h: 100%;
    background: var(--gold-2); filter: blur(100px); opacity: 0.15;
    border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);
  }
  .glass-phone {
    width: 320px; height: 650px;
    background: rgba(10, 10, 10, 0.6);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 215, 0, 0.15);
    border-radius: 40px; box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 4px #000;
    overflow: hidden; position: relative;
    display: flex; flex-direction: column;
    transform: rotateY(-5deg) rotateX(2deg);
    transition: transform 0.5s ease;
  }
  .visual-wrapper:hover .glass-phone {
    transform: rotateY(0deg) rotateX(0deg) translateY(-10px);
  }
  
  .phone-notch {
    position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
    width: 120px; height: 28px; background: #000;
    border-radius: 14px; z-index: 10;
  }

  .phone-header {
    padding: 50px 20px 20px;
    background: linear-gradient(to bottom, rgba(255,215,0,0.05), transparent);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .phone-title {
    font-family: var(--font-display); font-size: 18px; font-weight: 700;
    color: #fff; text-align: center; letter-spacing: 0.05em;
  }

  .phone-body {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    position: relative; padding: 20px;
  }

  /* Scan Radar */
  .scan-radar {
    width: 140px; height: 140px; border-radius: 50%;
    border: 1px solid rgba(255,215,0,0.2);
    position: relative; display: flex; align-items: center; justify-content: center;
  }
  .scan-radar::before {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    border: 1px solid var(--gold-2);
    animation: radarPing 2s infinite ease-out;
  }
  @keyframes radarPing {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  .scan-text {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--gold-2); letter-spacing: 0.2em; text-transform: uppercase;
    position: absolute; bottom: -40px;
    animation: blink 1.5s infinite;
  }

  /* Signal Display */
  .signal-box {
    text-align: center; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .signal-alert {
    display: inline-block; padding: 4px 12px; border-radius: 100px;
    background: rgba(0, 230, 118, 0.15); color: var(--green);
    font-family: var(--font-mono); font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; margin-bottom: 20px;
    box-shadow: 0 0 20px rgba(0, 230, 118, 0.2);
  }
  .signal-multiplier {
    font-family: var(--font-display); font-size: 64px; font-weight: 900;
    line-height: 1; color: #fff; text-shadow: 0 0 30px rgba(255,255,255,0.3);
  }

  .phone-footer {
    padding: 15px 20px; background: rgba(0,0,0,0.5);
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .history-row { display: flex; gap: 8px; justify-content: space-between; }
  .history-item {
    font-family: var(--font-mono); font-size: 10px; font-weight: 700;
    padding: 6px 0; flex: 1; text-align: center; border-radius: 4px;
    background: rgba(255,255,255,0.05); color: #888;
  }
  .history-item.high { background: rgba(255,215,0,0.1); color: var(--gold-2); border: 1px solid rgba(255,215,0,0.2); }

  /* ── SECTIONS ── */
  .section { padding: 100px 5%; max-width: 1200px; margin: 0 auto; }
  .section-title {
    text-align: center; font-family: var(--font-display);
    font-size: clamp(32px, 5vw, 48px); font-weight: 900;
    text-transform: uppercase; margin-bottom: 60px;
  }

  .features {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }
  .feature-card {
    background: var(--bg-card); border: 1px solid rgba(255,255,255,0.03);
    padding: 40px; border-radius: 20px;
    transition: all 0.3s;
  }
  .feature-card:hover {
    background: rgba(255,215,0,0.03); border-color: rgba(255,215,0,0.2);
    transform: translateY(-5px);
  }
  .feat-icon {
    width: 60px; height: 60px; border-radius: 12px;
    background: rgba(255,215,0,0.1); color: var(--gold-2);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; margin-bottom: 24px;
  }
  .feat-title {
    font-family: var(--font-display); font-size: 24px; font-weight: 700;
    color: #fff; margin-bottom: 12px;
  }
  .feat-desc { font-size: 15px; color: #999; line-height: 1.6; }

  /* ── FOOTER ── */
  footer {
    background: #000; padding: 40px 5%;
    border-top: 1px solid rgba(255,255,255,0.05); text-align: center;
  }
  .footer-text { font-size: 13px; color: #666; margin-top: 20px; }
\`;

function App() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [status, setStatus] = useState('scanning'); // scanning, signal, flying
  const [history, setHistory] = useState([1.50, 4.25, 1.12, 10.40, 2.05]);

  useEffect(() => {
    let timeout, interval;
    if (status === 'scanning') {
      timeout = setTimeout(() => setStatus('signal'), 3000);
    } else if (status === 'signal') {
      timeout = setTimeout(() => setStatus('flying'), 2000);
    } else if (status === 'flying') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const next = +(prev + 0.05).toFixed(2);
          if (next > 3.50) {
            setHistory(h => [parseFloat(next.toFixed(2)), ...h.slice(0, 4)]);
            setStatus('scanning');
            return 1.00;
          }
          return next;
        });
      }, 50);
    }
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [status]);

  return (
    <>
      <style>{globalStyles}</style>
      <div className="bg-glow"></div>
      <div className="bg-grid"></div>

      <nav>
        <div className="nav-logo">
          <span className="nav-logo-icon">♛</span> SHEIK
        </div>
        <button className="nav-btn">Acesso VIP</button>
      </nav>

      <section className="hero">
        <div className="hero-container">
          <div className="hero-text">
            <div className="status-badge">
              <span className="status-dot"></span> Sinais Ao Vivo
            </div>
            
            <h1 className="hero-title">
              MÉTODO SHEIK<br/>
              <span className="highlight">BRASILEIRO</span><br/>
              <span className="outline">MILIONÁRIO.</span>
            </h1>
            
            <p className="hero-desc">
              Chega de adivinhar. Nosso sistema analisa o algoritmo e te envia o <strong>sinal exato</strong>. Zero experiência. Zero complicações. Só copiar e lucrar.
            </p>
            
            <a href="#" className="hero-cta">
              Quero Começar Agora
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
            
            <div className="trust-indicators">
              <span><i>✓</i> Funciona no Celular</span>
              <span><i>✓</i> Suporte VIP 24h</span>
            </div>
          </div>

          <div className="visual-wrapper">
            <div className="phone-glow"></div>
            <div className="glass-phone">
              <div className="phone-notch"></div>
              
              <div className="phone-header">
                <div className="phone-title">VIP SHEIK ⚜</div>
              </div>

              <div className="phone-body">
                {status === 'scanning' && (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <div className="scan-radar">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold-2)" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div className="scan-text">Lendo Algoritmo...</div>
                  </div>
                )}
                
                {status === 'signal' && (
                  <div className="signal-box">
                    <div className="signal-alert">● SINAL CONFIRMADO</div>
                    <div className="signal-multiplier">1.50x</div>
                    <div style={{color:'#888', fontSize:'12px', marginTop:'10px', textTransform:'uppercase', letterSpacing:'1px'}}>Entrada Automática</div>
                  </div>
                )}

                {status === 'flying' && (
                  <div className="signal-box">
                    <div style={{color:'var(--gold-2)', fontSize:'12px', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'2px'}}>Multiplicador Atual</div>
                    <div className="signal-multiplier" style={{color: multiplier > 2 ? 'var(--gold-1)' : '#fff'}}>
                      {multiplier.toFixed(2)}x
                    </div>
                  </div>
                )}
              </div>

              <div className="phone-footer">
                <div style={{fontSize:'10px', color:'#666', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px'}}>Últimos Sinais</div>
                <div className="history-row">
                  {history.map((h, i) => (
                    <div key={i} className={\`history-item \${h >= 2 ? 'high' : ''}\`}>{h.toFixed(2)}x</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Como <span style={{color:'var(--gold-2)'}}>Funciona?</span></h2>
        <div className="features">
          <div className="feature-card">
            <div className="feat-icon">1</div>
            <h3 className="feat-title">Acesse o VIP</h3>
            <p className="feat-desc">Entre no nosso grupo exclusivo no Telegram onde o robô está conectado 24 horas por dia lendo o mercado.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">2</div>
            <h3 className="feat-title">Receba o Sinal</h3>
            <p className="feat-desc">O sistema notifica no seu celular o momento exato de entrar na jogada com base em matemática pura.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">3</div>
            <h3 className="feat-title">Aperte um Botão</h3>
            <p className="feat-desc">Apenas copie a recomendação, retire no valor indicado e veja o seu saldo crescer diariamente sem stress.</p>
          </div>
        </div>
      </section>

      <footer>
        <div style={{fontFamily:'var(--font-display)', color:'var(--gold-2)', fontSize:'24px', fontWeight:'900', marginBottom:'15px'}}>♛ MÉTODO SHEIK</div>
        <div style={{marginBottom:'20px'}}>
          <span style={{padding:'8px 16px', background:'rgba(255,0,0,0.1)', color:'var(--red)', borderRadius:'8px', fontSize:'12px', display:'inline-block'}}>
            ⚠️ PROIBIDO PARA MENORES DE 18 ANOS. JOGUE COM RESPONSABILIDADE.
          </span>
        </div>
        <p className="footer-text">Copyright © 2026 Método Sheik Brasileiro. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
`;

fs.writeFileSync('LandingPage.jsx', jsxContent);

// Also update public/index.html
const processedJsx = jsxContent.replace(/import React.*?from 'react';/, 'const { useState, useEffect, useRef } = React;');

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Método Sheik Brasileiro Milionário</title>
  <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Google Fonts for premium look -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;700;900&family=Space+Mono:wght@700&display=swap" rel="stylesheet">
</head>
<body style="background: #050505; color: white;">
  <div id="root"></div>
  <script type="text/babel">
${processedJsx}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;

fs.writeFileSync('public/index.html', htmlContent);
console.log('Update success');
