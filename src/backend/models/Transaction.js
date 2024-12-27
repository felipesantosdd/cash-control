const { v4: uuidv4 } = require("uuid");
const { getDatabase } = require("../config/database");

class Transaction {
  static create(transaction) {
    try {
      const db = getDatabase();
      const id = uuidv4();

      // Garante que os valores estejam no formato correto
      const params = {
        id: String(id),
        valor: Number(transaction.valor),
        tipo: String(transaction.tipo),
        category_id: transaction.category_id
          ? String(transaction.category_id)
          : null,
        comentario: transaction.comentario
          ? String(transaction.comentario)
          : null,
        maturity: transaction.maturity ? String(transaction.maturity) : null,
        pay: transaction.pay ? 1 : 0,
        link: transaction.link ? String(transaction.link) : null,
      };

      const stmt = db.prepare(`
        INSERT INTO transactions (
          id, valor, tipo, category_id, comentario, 
          maturity, pay, link, created_at
        ) VALUES (
          @id, @valor, @tipo, @category_id, @comentario,
          @maturity, @pay, @link, datetime('now')
        )
      `);

      stmt.run(params);

      return {
        ...params,
        pay: Boolean(params.pay),
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Model: Erro ao criar transação:", error);
      throw error;
    }
  }

  static getAll() {
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
        SELECT t.*, c.name as category_name 
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY created_at DESC
      `);

      const transactions = stmt.all();
      return transactions.map((transaction) => ({
        ...transaction,
        pay: Boolean(transaction.pay),
      }));
    } catch (error) {
      console.error("Model: Erro ao buscar todas transações:", error);
      throw error;
    }
  }

  static getByYear(year) {
    try {
      const db = getDatabase();
      const startDate = `${year}-01-01T00:00:00.000Z`;
      const endDate = `${year}-12-31T23:59:59.999Z`;

      const stmt = db.prepare(`
        SELECT t.*, c.name as category_name 
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE datetime(maturity) >= datetime(@startDate)
        AND datetime(maturity) <= datetime(@endDate)
        ORDER BY maturity ASC
      `);

      const transactions = stmt.all({
        startDate: String(startDate),
        endDate: String(endDate),
      });

      return transactions.map((transaction) => ({
        ...transaction,
        pay: Boolean(transaction.pay),
      }));
    } catch (error) {
      console.error("Model: Erro ao buscar transações por ano:", error);
      throw error;
    }
  }

  static update(id, transactionData) {
    try {
      const db = getDatabase();

      // Garante que os valores a serem atualizados estejam no formato correto
      const params = {};
      if ("valor" in transactionData)
        params.valor = Number(transactionData.valor);
      if ("tipo" in transactionData) params.tipo = String(transactionData.tipo);
      if ("category_id" in transactionData)
        params.category_id = transactionData.category_id
          ? String(transactionData.category_id)
          : null;
      if ("comentario" in transactionData)
        params.comentario = transactionData.comentario
          ? String(transactionData.comentario)
          : null;
      if ("maturity" in transactionData)
        params.maturity = transactionData.maturity
          ? String(transactionData.maturity)
          : null;
      if ("pay" in transactionData) params.pay = transactionData.pay ? 1 : 0;
      if ("link" in transactionData)
        params.link = transactionData.link
          ? String(transactionData.link)
          : null;

      if (Object.keys(params).length === 0) {
        throw new Error("Nenhum dado fornecido para atualização");
      }

      const setClauses = Object.keys(params)
        .map((field) => `${field} = @${field}`)
        .join(", ");

      const stmt = db.prepare(`
        UPDATE transactions 
        SET ${setClauses}
        WHERE id = @id
      `);

      const result = stmt.run({ ...params, id: String(id) });

      if (result.changes === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      console.error("Model: Erro ao atualizar transação:", error);
      throw error;
    }
  }

  static findById(id) {
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
        SELECT t.*, c.name as category_name 
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = @id
      `);

      const transaction = stmt.get({ id: String(id) });

      if (transaction) {
        return {
          ...transaction,
          pay: Boolean(transaction.pay),
        };
      }

      return null;
    } catch (error) {
      console.error("Model: Erro ao buscar transação por ID:", error);
      throw error;
    }
  }

  static delete(id) {
    try {
      const db = getDatabase();
      const stmt = db.prepare("DELETE FROM transactions WHERE id = @id");
      const result = stmt.run({ id: String(id) });
      return { changes: result.changes };
    } catch (error) {
      console.error("Model: Erro ao deletar transação:", error);
      throw error;
    }
  }
}

module.exports = Transaction;
