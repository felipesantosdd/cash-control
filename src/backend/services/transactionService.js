const Transaction = require('../models/Transaction');

class TransactionService {
  async createTransaction(transactionData) {
    try {
      // Validações
      if (!transactionData.valor || isNaN(Number(transactionData.valor))) {
        throw new Error('Valor inválido');
      }

      if (!transactionData.tipo || !['entrada', 'saida'].includes(transactionData.tipo)) {
        throw new Error('Tipo inválido');
      }

      if (!transactionData.category_id) {
        throw new Error('Categoria é obrigatória');
      }

      console.log('Dados recebidos para criar transação:', transactionData); // NOVO: Log

      const transaction = await Transaction.create({
        valor: Number(transactionData.valor),
        tipo: transactionData.tipo,
        category_id: transactionData.category_id,
        comentario: transactionData.comentario || ''
      });

      console.log('Transação criada:', transaction); // NOVO: Log
      return transaction;
    } catch (error) {
      console.error('Erro no service de transação:', error);
      throw error;
    }
  }

  async getAllTransactions() {
    try {
      const transactions = await Transaction.getAll();
      return transactions;
    } catch (error) {
      throw new Error(`Erro ao buscar transações: ${error.message}`);
    }
  }

  async getTransactionById(id) {
    try {
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      return transaction;
    } catch (error) {
      throw new Error(`Erro ao buscar transação: ${error.message}`);
    }
  }

  async calculateBalance() {
    try {
      const transactions = await Transaction.getAll();
      return transactions.reduce((acc, transaction) => {
        const valor = Number(transaction.valor);
        return transaction.tipo === 'entrada' 
          ? acc + valor 
          : acc - valor;
      }, 0);
    } catch (error) {
      throw new Error(`Erro ao calcular saldo: ${error.message}`);
    }
  }
}

module.exports = new TransactionService();