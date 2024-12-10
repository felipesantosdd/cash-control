import React, { useEffect, useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
const { capitalizeText } = require('../utils/stringUtils');


const TransactionForm = ({ onClose, onSubmit }) => {

    const { TRANSACTION_TYPES, categories, fetchCategories, createCategory } = useTransaction();  

    const [formData, setFormData] = useState({
        valor: '',
        tipo: 'entrada',
        category_id: '', 
        comentario: ''
    });

    const [newCategory, setNewCategory] = useState(''); 
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: capitalizeText(value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            console.log('Tentando criar categoria:', newCategory); // NOVO: Log

            if (!newCategory.trim()) {
                alert('Nome da categoria não pode estar vazio');
                return;
            }

            const capitalizedName = capitalizeText(newCategory);
            const category = await createCategory(capitalizedName);

            console.log('Categoria criada com sucesso:', category); // NOVO: Log

            if (category && category.id) {
                setFormData(prev => ({ ...prev, category_id: category.id }));
                setNewCategory('');
                setIsAddingCategory(false);
            } else {
                throw new Error('Resposta inválida do servidor');
            }
        } catch (error) {
            console.error('Erro detalhado ao criar categoria:', {
                message: error.message,
                stack: error.stack
            });
            alert(`Erro ao criar categoria: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchCategories(); 
    }, [fetchCategories]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl mb-4">Nova Transação</h2>
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="block mb-2">Categoria:</label>
                        {!isAddingCategory ? (
                            <div className="flex gap-2">
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="border p-2 flex-1 rounded"
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCategory(true)}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Nova
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="border p-2 flex-1 rounded"
                                    placeholder="Nome da categoria"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Adicionar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCategory(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Valor:</label>
                        <input
                            type="number"
                            name="valor"
                            value={formData.valor}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Tipo:</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        >
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saída</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Comentário:</label>
                        <textarea
                            name="comentario"
                            value={formData.comentario}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;