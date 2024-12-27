const { v4: uuidv4 } = require("uuid");
const { getDatabase } = require("../config/database");

class Category {
  static create(name) {
    try {
      const db = getDatabase();
      const id = uuidv4();

      const stmt = db.prepare(
        "INSERT INTO categories (id, name) VALUES (?, ?)"
      );
      stmt.run(id, name);

      return { id, name };
    } catch (error) {
      console.error("Model: Erro ao criar categoria:", error);
      throw error;
    }
  }

  static getAll() {
    try {
      const db = getDatabase();
      const stmt = db.prepare("SELECT * FROM categories ORDER BY name");
      return stmt.all();
    } catch (error) {
      console.error("Model: Erro ao buscar todas categorias:", error);
      throw error;
    }
  }

  static findById(id) {
    try {
      const db = getDatabase();
      const stmt = db.prepare("SELECT * FROM categories WHERE id = ?");
      return stmt.get(id);
    } catch (error) {
      console.error("Model: Erro ao buscar categoria por ID:", error);
      throw error;
    }
  }

  static findByName(name) {
    try {
      const db = getDatabase();
      const stmt = db.prepare("SELECT * FROM categories WHERE name = ?");
      return stmt.get(name);
    } catch (error) {
      console.error("Model: Erro ao buscar categoria por nome:", error);
      throw error;
    }
  }

  // Métodos adicionais úteis
  static update(id, name) {
    try {
      const db = getDatabase();
      const stmt = db.prepare("UPDATE categories SET name = ? WHERE id = ?");
      const result = stmt.run(name, id);
      return result.changes > 0;
    } catch (error) {
      console.error("Model: Erro ao atualizar categoria:", error);
      throw error;
    }
  }

  static delete(id) {
    try {
      const db = getDatabase();
      const stmt = db.prepare("DELETE FROM categories WHERE id = ?");
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Model: Erro ao deletar categoria:", error);
      throw error;
    }
  }

  // Método de transação para operações em lote
  static createMany(categories) {
    try {
      const db = getDatabase();
      const stmt = db.prepare(
        "INSERT INTO categories (id, name) VALUES (?, ?)"
      );

      const insertMany = db.transaction((categories) => {
        return categories.map((category) => {
          const id = uuidv4();
          stmt.run(id, category.name);
          return { id, name: category.name };
        });
      });

      return insertMany(categories);
    } catch (error) {
      console.error("Model: Erro ao criar múltiplas categorias:", error);
      throw error;
    }
  }
}

module.exports = Category;
