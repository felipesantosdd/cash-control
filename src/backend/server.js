// src/backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const transactionsRoutes = require('./routes/transactions');
const categoriesRoutes = require('./routes/categories');

const app = express();

// NOVO: Configuração mais detalhada do CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// NOVO: Middleware para log de todas as requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, {
        headers: req.headers,
        body: req.body
    });
    next();
});

app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', categoriesRoutes);

// NOVO: Middleware para erros
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    res.status(500).json({ error: err.message });
});

const PORT = 3000;

const server = app.listen(PORT, () => {});

// NOVO: Tratamento de erros do servidor
server.on('error', (error) => {
    console.error('Erro no servidor:', error);
    if (error.code === 'EADDRINUSE') {
        console.log('Porta já em uso. Tentando outra porta...');
        server.listen(0);
    }
});

process.on('exit', (code) => {
    console.log(`Processo do Node.js saindo com o código ${code}`);
  });

module.exports = app;