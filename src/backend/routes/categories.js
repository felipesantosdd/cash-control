const express = require('express');
const categoryService = require('../services/categoryService');


const router = express.Router();

// Rota para listar todas as categorias
router.get('/', async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();  // MODIFICADO: Usa o service
    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar uma nova categoria
router.post('/', async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body.name);
    res.status(201).json(category);
  } catch (error) {
    console.error('Erro na rota:', error); // NOVO: Log para debug
    res.status(400).json({ error: error.message });
  }
});

// NOVO: Rota para buscar categoria por ID
router.get('/:id', async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    if (error.message.includes('não encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;