const Transaction = require('../models/Transaction');

class TransactionService {
  async createTransaction(transactionData) {
    try {
      // Validação dos dados
      const { valor, tipo, comentario } = transactionData;
      
      if (!valor || !tipo) {
        throw new Error('Valor e tipo são campos obrigatórios');
      }

      if (tipo !== 'entrada' && tipo !== 'saida') {
        throw new Error('Tipo deve ser entrada ou saida');
      }

      // Formatação dos dados
      const formattedTransaction = {
        valor: Number(valor),
        tipo,
        comentario: comentario || ''
      };

      // Criação da transação
      const transaction = await Transaction.create(formattedTransaction);
      return transaction;
    } catch (error) {
      throw new Error(`Erro ao criar transação: ${error.message}`);
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