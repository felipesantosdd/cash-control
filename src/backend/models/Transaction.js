const { v4: uuidv4 } = require("uuid");
const { getDatabase } = require("../config/database");

class Transaction {
  static async create(transaction) {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const { valor, tipo, category_id, comentario, maturity, pay } =
        transaction;

      db.run(
        `INSERT INTO transactions (
          id, 
          valor, 
          tipo, 
          category_id, 
          comentario,
          maturity,
          pay,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [id, valor, tipo, category_id, comentario, maturity, pay],
        function (err) {
          if (err) {
            console.error("Erro ao inserir transação:", err);
            reject(err);
          } else {
            resolve({
              id,
              valor,
              tipo,
              category_id,
              comentario,
              maturity,
              pay,
              created_at: new Date().toISOString(),
            });
          }
        }
      );
    });
  }

  static async getAll() {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM transactions ORDER BY created_at DESC",
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async findById(id) {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM transactions WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async delete(id) {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM transactions WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          // retorna o número de linhas afetadas
          resolve({ changes: this.changes });
        }
      });
    });
  }

  static async update(id, transactionData) {
    const db = await getDatabase();

    try {
      // Se não houver dados para atualizar, retorna erro
      if (Object.keys(transactionData).length === 0) {
        throw new Error("Nenhum dado fornecido para atualização");
      }

      // Cria a query dinâmica baseada nos campos fornecidos
      const fields = Object.keys(transactionData);
      const values = Object.values(transactionData);

      // Adiciona o id aos valores
      values.push(id);

      // Cria a parte SET da query
      const setClause = fields.map((field) => `${field} = ?`).join(", ");

      // Query completa com WHERE
      const query = `UPDATE transactions SET ${setClause} WHERE id = ?`;

      return new Promise((resolve, reject) => {
        db.run(query, values, async function (err) {
          if (err) {
            reject(err);
          } else {
            if (this.changes === 0) {
              resolve(null); // Nenhum registro foi atualizado
            } else {
              // Busca a transação atualizada
              const updatedTransaction = await Transaction.findById(id);
              resolve(updatedTransaction);
            }
          }
        });
      });
    } catch (error) {
      console.error("Erro na atualização:", error);
      throw error;
    }
  }

  static async getByYear(year = new Date().getFullYear()) {
    const db = await getDatabase();

    // Datas para o início e fim do ano
    const startDate = `${year}-01-01T00:00:00.000Z`;
    const endDate = `${year}-12-31T23:59:59.999Z`;

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM transactions 
       WHERE datetime(maturity) >= datetime(?)
       AND datetime(maturity) <= datetime(?)
       ORDER BY maturity ASC`,
        [startDate, endDate],
        (err, rows) => {
          if (err) {
            console.error("Erro SQL:", err);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = Transaction;
