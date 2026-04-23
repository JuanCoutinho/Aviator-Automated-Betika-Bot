const BettingStrategy = require("./strategies");
const StatsTracker = require("./statsTracker");
const logger = require("../util/logger");

class GameMonitor {
    constructor(io, config) {
        this.io = io;
        this.config = config;
        this.strategy = new BettingStrategy(config.BETTING_STRATEGIES.MODERATE);
        this.statsTracker = new StatsTracker();

        this.liveMult = 1.0;
        this.liveBalance = null;
        this.multiplierHistory = [];
        this.historySize = config.GAME.HISTORY_SIZE || 10;
        this.previousMultiplier = null;
        this.currentSignal = null;
        this.lastSignalTime = 0;
        this.realDataActive = false;
        this.wsPacketCount = 0;
    }

    setBalance(value) {
        this.liveBalance = value;
    }

    // Chamado pelo index.js para cada frame WebSocket recebido
    handleWsFrame(payload) {
        if (typeof payload !== 'string' || payload.length === 0) return;
        this.wsPacketCount++;

        // Pacotes binários chegam como base64 (CDP converte automaticamente)
        // Pacotes de texto chegam como string JSON
        const looksLikeBase64 = /^[A-Za-z0-9+/]+=*$/.test(payload) && payload.length % 4 === 0;

        if (looksLikeBase64) {
            this.decodeBinaryFrame(payload);
            return;
        }

        // Pacote de texto: tenta JSON
        try {
            const patterns = [
                /"m"\s*:\s*([\d]+\.[\d]+)/,
                /"c"\s*:\s*([\d]+\.[\d]+)/,
                /"coef"\s*:\s*([\d]+\.[\d]+)/,
                /"multiplier"\s*:\s*([\d]+\.[\d]+)/,
            ];
            for (const pat of patterns) {
                const match = payload.match(pat);
                if (match) {
                    const m = parseFloat(match[1]);
                    if (m >= 1.0 && m <= 1000) { this.onRealMultiplier(m); return; }
                }
            }
        } catch (e) {}
    }

    // Decodifica frames binários do protocolo Spribe
    decodeBinaryFrame(base64Payload) {
        try {
            const buf = Buffer.from(base64Payload, 'base64');

            // Primeiros 5 pacotes: imprime todos os float32 possíveis para diagnóstico
            if (this.wsPacketCount <= 5 && buf.length >= 42 && buf.length <= 65) {
                const candidates = [];
                for (let i = 0; i <= buf.length - 4; i++) {
                    const v = buf.readFloatBE(i);
                    if (v >= 1.0 && v <= 200.0 && Number.isFinite(v) && !isNaN(v)) {
                        candidates.push(`@${i}=${v.toFixed(2)}`);
                    }
                }
                if (candidates.length > 0) {
                    logger.info(`🔎 Floats válidos no pkt#${this.wsPacketCount} [${buf.length}b]: ${candidates.join(' ')}`);
                }
            }

            // Pacotes de tick do Aviator têm ~60 bytes (80 chars base64)
            // O multiplicador fica como float32 big-endian no offset 33
            if (buf.length >= 42 && buf.length <= 65) {
                // Tenta float32 BE em vários offsets próximos
                for (const offset of [33, 32, 31, 34, 35, 30]) {
                    if (offset + 4 > buf.length) continue;
                    try {
                        const val = buf.readFloatBE(offset);
                        if (val >= 1.0 && val <= 200.0 && Number.isFinite(val)) {
                            const rounded = Math.round(val * 100) / 100;
                            if (Math.abs(rounded - val) < 0.005) {
                                this.onRealMultiplier(rounded);
                                if (this.wsPacketCount <= 10 || this.wsPacketCount % 200 === 0) {
                                    logger.info(`✅ MULT REAL float32@${offset} [${buf.length}b]: ${rounded}x`);
                                }
                                return;
                            }
                        }
                    } catch (e) {}
                }
            }

            // Pacotes grandes (>200 bytes) podem conter JSON embarcado como string
            if (buf.length > 200) {
                const str = buf.toString('utf8');
                const patterns = [
                    /"m"\s*:\s*([\d]+\.[\d]+)/,
                    /"coef"\s*:\s*([\d]+\.[\d]+)/,
                    /"multiplier"\s*:\s*([\d]+\.[\d]+)/,
                ];
                for (const pat of patterns) {
                    const match = str.match(pat);
                    if (match) {
                        const m = parseFloat(match[1]);
                        if (m >= 1.0 && m <= 1000) { this.onRealMultiplier(m); return; }
                    }
                }
            }
        } catch (e) {}
    }

    generateSignal() {
        const avg = this.multiplierHistory.length > 0
            ? this.multiplierHistory.reduce((a, b) => a + b, 0) / this.multiplierHistory.length
            : 2.0;
        const threshold = this.strategy.averageMultiplierThreshold || 2;
        const shouldBet = avg <= threshold && this.multiplierHistory.length >= 3;
        const targets = [1.50, 1.80, 2.00, 2.50, 3.00];
        const target = targets[Math.floor(Math.random() * targets.length)];
        return {
            shouldBet,
            confidence: shouldBet
                ? Math.floor(72 + Math.random() * 22)
                : Math.floor(38 + Math.random() * 28),
            target,
            avgHistory: parseFloat(avg.toFixed(2)),
        };
    }

    emitUpdate(mult) {
        const now = Date.now();
        if (!this.currentSignal || (now - this.lastSignalTime) > 8000) {
            this.currentSignal = this.generateSignal();
            this.lastSignalTime = now;
        }

        const balanceDisplay = this.liveBalance !== null
            ? this.liveBalance.toFixed(2)
            : '---';

        this.io.emit('game_update', {
            multiplier: mult,
            balance: balanceDisplay,
            profit: '0.00',
            winRate: '0.0',
            totalTrades: 0,
            history: [...this.multiplierHistory],
            canBet: this.currentSignal.shouldBet,
            signal: this.currentSignal,
            realData: this.realDataActive
        });
    }

    async monitorGame() {
        const mult = this.liveMult;

        // Detecta fim de rodada (mult voltou a 1.0 após ter subido)
        if (this.previousMultiplier && this.previousMultiplier > 1.12 && mult <= 1.05) {
            const crashed = parseFloat(this.previousMultiplier.toFixed(2));
            logger.info(`🛬 Rodada terminou em ${crashed}x`);
            this.multiplierHistory.unshift(crashed);
            if (this.multiplierHistory.length > this.historySize) this.multiplierHistory.pop();
            this.currentSignal = null;
        }
        this.previousMultiplier = mult;

        // Emite a cada tick (mesmo sem dados reais, anima o painel)
        this.emitUpdate(mult);

        logger.info(
            `Mult: ${mult.toFixed(2)}x | ` +
            `Saldo: R$${this.liveBalance !== null ? this.liveBalance.toFixed(2) : '?'} | ` +
            `Histórico: [${this.multiplierHistory.slice(0, 5).join(', ')}] | ` +
            `WS real: ${this.realDataActive ? `SIM ✅ (${this.wsPacketCount} pkts)` : 'aguardando...'}`
        );
    }

    startMonitoring() {
        logger.info('🚀 Starting game monitoring with aggressive strategy...');
        setInterval(() => this.monitorGame(), 4000);
    }
}

module.exports = GameMonitor;