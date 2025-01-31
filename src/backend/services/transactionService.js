const Transaction = require("../models/Transaction");

class TransactionService {
  async createTransaction(transactionData) {
    try {
      const transaction = await Transaction.create({
        valor: Number(transactionData.valor),
        tipo: transactionData.tipo,
        category_id: transactionData.category_id,
        comentario: transactionData.comentario || "",
        maturity: transactionData.maturity || "",
        link: transactionData.link || "",
        pay: false,
      });

      return transaction;
    } catch (error) {
      console.error("Erro no service de transação:", error);
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

  async getTransactionsByYear(year = new Date().getFullYear()) {
    try {
      const transactions = await Transaction.getByYear(year);
      return transactions;
    } catch (error) {
      throw new Error(`Erro ao buscar transações: ${error.message}`);
    }
  }

  async updateTransaction(id, transactionData) {
    try {
      const updateTransaction = await Transaction.update(id, transactionData);

      if (!updateTransaction) {
        throw new Error("Transação não encontrada");
      }

      return updateTransaction;
    } catch (error) {
      throw new Error(`Erro ao atualizar transação: ${error.message}`);
    }
  }

  async getTransactionById(id) {
    try {
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        throw new Error("Transação não encontrada");
      }
      return transaction;
    } catch (error) {
      throw new Error(`Erro ao buscar transação: ${error.message}`);
    }
  }

  async deleteTransactionById(id) {
    try {
      await Transaction.delete(id);
      return;
    } catch (error) {
      throw new Error(`Erro ao deletar transação: ${error.message}`);
    }
  }

  async calculateBalance() {
    try {
      const transactions = await Transaction.getAll();
      return transactions.reduce((acc, transaction) => {
        const valor = Number(transaction.valor);
        return transaction.tipo === "entrada" ? acc + valor : acc - valor;
      }, 0);
    } catch (error) {
      throw new Error(`Erro ao calcular saldo: ${error.message}`);
    }
  }
}

module.exports = new TransactionService();
