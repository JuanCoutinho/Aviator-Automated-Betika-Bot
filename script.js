const socket = io();

const scanningUI = document.getElementById('scanning-ui');
const signalUI = document.getElementById('signal-ui');
const flyingUI = document.getElementById('flying-ui');
const multDisplay = document.getElementById('current-mult');
const historyList = document.getElementById('history-list');
const profitDisplay = document.getElementById('profit-val');
const botStatus = document.getElementById('bot-status');

socket.on('game_update', (data) => {
    // Atualizar Lucro e Dados
    profitDisplay.innerText = 'R$ ' + data.profit.replace('.', ',');

    // Lógica de Troca de Telas
    if (data.multiplier > 1.00 && data.multiplier < 1.05 && data.canBet) {
        // Mostrar Sinal Confirmado
        scanningUI.style.display = 'none';
        signalUI.style.display = 'block';
        flyingUI.style.display = 'none';
        botStatus.innerText = 'SIGNAL_FOUND';
        botStatus.style.color = '#10b981';
    } else if (data.multiplier >= 1.05) {
        // Mostrar Multiplicador Voando
        scanningUI.style.display = 'none';
        signalUI.style.display = 'none';
        flyingUI.style.display = 'block';
        multDisplay.innerText = data.multiplier.toFixed(2) + 'x';
        
        // Cores padrão Aviator
        if (data.multiplier < 2) multDisplay.style.color = '#fff';
        else if (data.multiplier < 10) multDisplay.style.color = '#9b59b6';
        else multDisplay.style.color = '#e91e63';
        
        botStatus.innerText = 'LIVE_TRACKING';
        botStatus.style.color = '#3498db';
    } else {
        // Voltando para o Scan
        scanningUI.style.display = 'block';
        signalUI.style.display = 'none';
        flyingUI.style.display = 'none';
        botStatus.innerText = 'SCANNING_API';
        botStatus.style.color = '#10b981';
    }

    // Histórico de Velas Moderno
    if (data.history) {
        historyList.innerHTML = '';
        data.history.forEach((val) => {
            let type = 'v-blue';
            if (val >= 2) type = 'v-purple';
            if (val >= 10) type = 'v-pink';
            
            const vela = document.createElement('div');
            vela.className = `vela ${type}`;
            vela.innerText = val.toFixed(2) + 'x';
            historyList.appendChild(vela);
        });
    }
});