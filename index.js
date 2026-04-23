const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./util/logger');
const SignalEngine = require('./game/signalEngine');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3001;

app.use(express.static('public'));
app.get('/painel-vip', (req, res) => res.sendFile(__dirname + '/public/painel-vip.html'));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

server.listen(PORT, () => {
    logger.info(`✅ Servidor online: http://localhost:${PORT}`);
    logger.info(`📊 Painel VIP: http://localhost:${PORT}/painel-vip`);
});

io.on('connection', (socket) => {
    logger.info(`👤 Cliente conectado ao painel (total: ${io.engine.clientsCount})`);
});

const engine = new SignalEngine(io);
engine.iniciar();

logger.info('🚀 Sala de Sinais Aviator iniciada!');