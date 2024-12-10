const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../config/database');

class Category {
  static async create(name) {
    try {
        
        
        const db = await getDatabase();
        const id = uuidv4();

        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO categories (id, name) VALUES (?, ?)',
                [id, name],
                function(err) {
                    if (err) {
                        console.error('Model: Erro ao inserir no banco:', err); // NOVO: Log
                        reject(err);
                        return;
                    }
                    
                    const category = { id, name };
                    
                    resolve(category);
                }
            );
        });
    } catch (error) {
        console.error('Model: Erro inesperado:', error); // NOVO: Log
        throw error;
    }
}

  static async getAll() {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async findById(id) {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async findByName(name) {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE name = ?', [name], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = Category;