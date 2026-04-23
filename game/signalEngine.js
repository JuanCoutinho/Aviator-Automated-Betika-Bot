/**
 * Motor de Sinais do Aviator
 * Gera sequências de multiplicadores e sinais com o rítmo real do jogo
 */

const logger = require('../util/logger');

// Distribuição realista de multiplicadores do Aviator (Provably Fair)
function gerarMultiplicador() {
    const r = Math.random();
    if (r < 0.33) return +(1.0 + Math.random() * 0.49).toFixed(2);      // 33% crash logo (1.00-1.49x)
    if (r < 0.60) return +(1.5 + Math.random() * 0.99).toFixed(2);       // 27% medium (1.50-2.49x)
    if (r < 0.78) return +(2.5 + Math.random() * 2.49).toFixed(2);       // 18% bom (2.50-4.99x)
    if (r < 0.90) return +(5.0 + Math.random() * 9.99).toFixed(2);       // 12% alto (5.00-14.99x)
    if (r < 0.97) return +(15 + Math.random() * 35).toFixed(2);           // 7% rarão (15x-50x)
    return +(50 + Math.random() * 200).toFixed(2);                         // 3% lendário (50x-250x)
}

// Gera um sinal baseado no histórico
function gerarSinal(historico) {
    const media = historico.length > 0
        ? historico.slice(-5).reduce((a, b) => a + b, 0) / Math.min(historico.length, 5)
        : 2.0;

    // Se últimas rodadas foram baixas, sinaliza entrada
    const ultimasBaixas = historico.slice(-3).filter(m => m < 1.8).length;
    const deveEntrar = ultimasBaixas >= 2 || media < 1.9 || Math.random() < 0.35;

    const targets = [1.50, 1.80, 2.00, 2.50, 3.00];
    const target = deveEntrar
        ? targets[Math.floor(Math.random() * 3)]    // targets conservadores quando vai entrar
        : targets[2 + Math.floor(Math.random() * 3)]; // targets maiores na análise

    return {
        deveEntrar,
        confianca: deveEntrar
            ? Math.floor(75 + Math.random() * 20)   // 75-95% quando confirma
            : Math.floor(35 + Math.random() * 35),   // 35-70% quando analisa
        alvo: target,
        mediaHistorico: parseFloat(media.toFixed(2))
    };
}

class SignalEngine {
    constructor(io) {
        this.io = io;
        this.historico = [];
        this.estadoAtual = 'aguardando'; // aguardando | analisando | entrada | rodando | resultado
        this.multiplicadorAtual = 1.00;
        this.sinalAtual = null;
        this.proximoMultiplicador = null;
        this.totalRodadas = 0;
        this.totalGreens = 0;
    }

    emitir(extra = {}) {
        const winRate = this.totalRodadas > 0
            ? ((this.totalGreens / this.totalRodadas) * 100).toFixed(1)
            : '0.0';

        this.io.emit('game_update', {
            estado: this.estadoAtual,
            multiplicador: this.multiplicadorAtual,
            sinal: this.sinalAtual,
            historico: this.historico.slice(0, 10),
            totalRodadas: this.totalRodadas,
            winRate,
            ...extra
        });
    }

    async cicloCompleto() {
        // 1. FASE DE ANÁLISE (8-12s)
        this.estadoAtual = 'analisando';
        this.sinalAtual = gerarSinal(this.historico);
        this.proximoMultiplicador = gerarMultiplicador();
        this.multiplicadorAtual = 1.00;
        logger.info(`🔍 Analisando... próximo mult previsto: ${this.proximoMultiplicador}x | sinal: ${this.sinalAtual.deveEntrar ? '✅ ENTRADA' : '⏳ AGUARDAR'}`);
        this.emitir();
        await sleep(8000 + Math.random() * 4000);

        // 2. SINAL CONFIRMADO (3-5s antes do round abrir)
        if (this.sinalAtual.deveEntrar) {
            this.estadoAtual = 'entrada';
            logger.info(`🚀 ENTRADA CONFIRMADA - Alvo: ${this.sinalAtual.alvo}x | Confiança: ${this.sinalAtual.confianca}%`);
            this.emitir();
            await sleep(3000 + Math.random() * 2000);
        }

        // 3. RODADA ACONTECENDO (multiplicador sobe)
        this.estadoAtual = 'rodando';
        const duracao = 3000 + Math.random() * 5000; // 3-8s de rodada
        const passos = Math.floor(duracao / 300);
        for (let i = 0; i <= passos; i++) {
            const progresso = i / passos;
            // Animação exponencial do multiplicador
            this.multiplicadorAtual = parseFloat((1 + (this.proximoMultiplicador - 1) * progresso).toFixed(2));
            this.emitir();
            await sleep(300);
        }

        // 4. RESULTADO
        this.estadoAtual = 'resultado';
        this.multiplicadorAtual = this.proximoMultiplicador;
        this.historico.unshift(this.multiplicadorAtual);
        if (this.historico.length > 20) this.historico.pop();
        this.totalRodadas++;

        // Green = chegou no alvo antes de crashar
        const green = this.sinalAtual.deveEntrar && this.multiplicadorAtual >= this.sinalAtual.alvo;
        if (this.sinalAtual.deveEntrar && green) this.totalGreens++;

        logger.info(`🛬 Resultado: ${this.multiplicadorAtual}x | ${green ? '✅ GREEN' : this.sinalAtual.deveEntrar ? '❌ LOSS' : '➖ SEM ENTRADA'}`);
        this.emitir({ green: this.sinalAtual.deveEntrar ? green : null });
        await sleep(2500);

        // 5. AGUARDA PRÓXIMA RODADA
        this.estadoAtual = 'aguardando';
        this.multiplicadorAtual = 1.00;
        this.emitir();
        await sleep(2000 + Math.random() * 3000);
    }

    async iniciar() {
        logger.info('🎰 Motor de sinais iniciado!');

        // Pré-popula histórico com valores realistas
        for (let i = 0; i < 8; i++) {
            this.historico.push(gerarMultiplicador());
        }

        // Loop infinito de rodadas
        while (true) {
            try {
                await this.cicloCompleto();
            } catch (e) {
                logger.error('Erro no ciclo: ' + e.message);
                await sleep(3000);
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = SignalEngine;
