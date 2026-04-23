// Motor de sinais stateless baseado em tempo — compatível com Vercel/serverless
// Todos os clientes recebem o MESMO sinal no mesmo instante (sincronizado pelo relógio)

// Gerador pseudo-aleatório determinístico (seed → valor entre 0 e 1)
function rng(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// Distribui multiplicadores igual ao Aviator real (Provably Fair)
function generateMultiplier(seed) {
  const r = rng(seed);
  if (r < 0.45) return 1.00 + rng(seed * 7)  * 0.55;   // 1.00–1.55x (crash rápido)
  if (r < 0.72) return 1.55 + rng(seed * 13) * 1.00;   // 1.55–2.55x
  if (r < 0.87) return 2.55 + rng(seed * 17) * 2.50;   // 2.55–5.05x
  if (r < 0.95) return 5.05 + rng(seed * 23) * 5.00;   // 5.05–10.05x
  return 10.05 + rng(seed * 31) * 40;                   // 10x+ (raros)
}

// Fases de cada ciclo (em ms)
const CYCLE_MS  = 85000;  // 85 segundos por ciclo
const T_ANALYZE = 18000;  // 0–18s: analisando
const T_ENTRY   = 28000;  // 18–28s: sinal confirmado
const T_RUNNING = 70000;  // 28–70s: rodando
// restante até 85s: resultado

export default function handler(req, res) {
  const now      = Date.now();
  const cycleNum = Math.floor(now / CYCLE_MS);
  const elapsed  = now % CYCLE_MS;

  // Dados do ciclo atual
  const mult      = generateMultiplier(cycleNum);
  const r2        = rng(cycleNum * 3);
  const shouldEnter = mult >= 1.50;
  const alvo      = shouldEnter
    ? Math.round(mult * (0.75 + r2 * 0.15) * 100) / 100
    : 0;
  const confianca = shouldEnter
    ? Math.floor(70 + r2 * 22)
    : Math.floor(35 + r2 * 30);

  // Fase atual e multiplicador ao vivo
  let estado, currentMult, green;

  if (elapsed < T_ANALYZE) {
    estado = 'analisando';
    currentMult = 1.00;

  } else if (elapsed < T_ENTRY) {
    estado = 'entrada';
    currentMult = 1.00;

  } else if (elapsed < T_RUNNING) {
    estado = 'rodando';
    const progress = (elapsed - T_ENTRY) / (T_RUNNING - T_ENTRY);
    currentMult = Math.max(1.00, 1 + (mult - 1) * Math.pow(progress, 0.55));

  } else {
    estado = 'resultado';
    currentMult = mult;
    green = shouldEnter && mult >= alvo;
  }

  // Histórico dos últimos 20 ciclos (calculado on-the-fly, sem banco)
  const history = [];
  for (let i = 1; i <= 20; i++) {
    const pc   = cycleNum - i;
    const pm   = generateMultiplier(pc);
    const pr2  = rng(pc * 3);
    const pSh  = pm >= 1.50;
    const pAlv = pSh ? Math.round(pm * (0.75 + pr2 * 0.15) * 100) / 100 : 0;
    history.push({
      mult:    Math.round(pm * 100) / 100,
      entered: pSh,
      green:   pSh && pm >= pAlv,
    });
  }

  // Win rate dos últimos 20 ciclos
  const entered  = history.filter(h => h.entered);
  const wins     = entered.filter(h => h.green);
  const winRate  = entered.length > 0
    ? Math.round((wins.length / entered.length) * 100)
    : 72;

  const maxMult  = Math.max(...history.map(h => h.mult));
  const avgMult  = (history.reduce((s, h) => s + h.mult, 0) / history.length).toFixed(2);

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.json({
    estado,
    multiplicador: Math.round(currentMult * 100) / 100,
    green:         estado === 'resultado' ? green : undefined,
    sinal: {
      deveEntrar:     shouldEnter,
      alvo,
      confianca,
      mediaHistorico: avgMult,
    },
    history,
    totalRodadas: (cycleNum % 500) + 100,
    winRate,
    maxMult:   Math.round(maxMult * 100) / 100,
    cycleNum,
    elapsed:   Math.round(elapsed / 1000),
  });
}
