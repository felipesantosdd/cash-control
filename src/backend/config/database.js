const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../database.sqlite');

const createDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        reject(err);
        return;
      }
      
      console.log('Conectado ao banco de dados SQLite');
      
      // Criar tabela de transações
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          valor REAL NOT NULL,
          tipo TEXT NOT NULL,
          comentario TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela:', err);
          reject(err);
          return;
        }
        console.log('Tabela de transações criada/verificada com sucesso');
        resolve(db);
      });
    });
  });
};

let db = null;

const getDatabase = async () => {
  if (!db) {
    db = await createDatabase();
  }
  return db;
};

module.exports = { getDatabase };