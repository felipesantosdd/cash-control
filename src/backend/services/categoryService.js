const { capitalizeText } = require('../../utils/stringUtils');
const Category = require('../models/Category');

class CategoryService {
  async createCategory(name) {
    try {

        if (!name || typeof name !== 'string') {
            throw new Error('Nome da categoria é obrigatório e deve ser texto');
        }

        const normalizedName = name.trim();
        if (normalizedName.length < 2) {
            throw new Error('Nome da categoria deve ter pelo menos 2 caracteres');
        }

        const existingCategories = await Category.getAll();
        const categoryExists = existingCategories.some(
            cat => cat.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (categoryExists) {
            throw new Error('Já existe uma categoria com este nome');
        }

        const category = await Category.create(capitalizeText(normalizedName));
        
        return category;
    } catch (error) {
        console.error('Service: Erro ao criar categoria:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

  async getAllCategories() {
    try {
      const categories = await Category.getAll();
      return categories;
    } catch (error) {
      throw new Error(`Erro ao buscar categorias: ${error.message}`);
    }
  }

  async getCategoryById(id) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error('Categoria não encontrada');
      }
      return category;
    } catch (error) {
      throw new Error(`Erro ao buscar categoria: ${error.message}`);
    }
  }
}

module.exports = new CategoryService();