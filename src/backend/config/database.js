const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../database.sqlite');

const createDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        reject(err);
        return;
      }
      
      console.log('Conectado ao banco de dados SQLite');
      
      // NOVO: Criar tabela de categorias
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela de categorias:', err);
          reject(err);
          return;
        }
      });
      
      // MODIFICADO: Adiciona category_id na tabela de transactions
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          valor REAL NOT NULL,
          tipo TEXT NOT NULL,
          category_id TEXT,
          comentario TEXT,
          maturity TEXT,
          pay BOOLEAN, 
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela de transações:', err);
          reject(err);
          return;
        }
      
        db.run(`
          ALTER TABLE transactions
          ADD FOREIGN KEY (category_id) REFERENCES categories(id)
        `, (err) => {
          if (err) {
            console.error('Erro ao adicionar chave estrangeira na tabela de transações:', err);
            reject(err);
            return;
          }
        });
      });

      resolve(db);
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