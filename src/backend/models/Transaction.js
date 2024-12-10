const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../config/database');

class Transaction {
  static async create(transaction) {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const { valor, tipo, category_id, comentario } = transaction;
      
      console.log('Salvando transação:', { // NOVO: Log para debug
        id,
        valor,
        tipo,
        category_id,
        comentario
      });

      db.run(
        `INSERT INTO transactions (
          id, 
          valor, 
          tipo, 
          category_id, 
          comentario, 
          created_at
        ) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        [id, valor, tipo, category_id, comentario],
        function(err) {
          if (err) {
            console.error('Erro ao inserir transação:', err);
            reject(err);
          } else {
            // MODIFICADO: Retorna todos os dados
            resolve({
              id,
              valor,
              tipo,
              category_id,
              comentario,
              created_at: new Date().toISOString()
            });
          }
        }
      );
    });
  }


  static async getAll() {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM transactions ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Transaction;