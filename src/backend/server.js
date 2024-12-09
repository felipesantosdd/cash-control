const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const transactionsRoutes = require('./routes/transactions');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/transactions', transactionsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;