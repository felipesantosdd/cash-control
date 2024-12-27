const Database = require("better-sqlite3");
const path = require("path");
const electron = require("electron");

// Obtém o caminho correto para o banco de dados dependendo do ambiente
const getUserDataPath = () => {
  // Em produção, usa o diretório de dados do usuário
  if (electron.app) {
    return electron.app.getPath("userData");
  } else {
    // Em desenvolvimento, usa o diretório do app
    return path.resolve(__dirname, "../../../");
  }
};

const getDbPath = () => {
  return path.join(getUserDataPath(), "database.sqlite");
};

const createDatabase = () => {
  try {
    const dbPath = getDbPath();
    console.log("Caminho do banco:", dbPath);

    const db = new Database(dbPath, {
      verbose: console.log,
      fileMustExist: false, // permite criar o arquivo se não existir
    });

    // Habilita foreign keys
    db.pragma("foreign_keys = ON");

    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        valor REAL NOT NULL,
        tipo TEXT NOT NULL,
        category_id TEXT,
        comentario TEXT,
        maturity TEXT,
        pay BOOLEAN,
        link TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    return db;
  } catch (error) {
    console.error("Erro ao criar banco:", error);
    throw error;
  }
};

let db = null;

const getDatabase = () => {
  if (!db) {
    db = createDatabase();
  }
  return db;
};

module.exports = { getDatabase };
