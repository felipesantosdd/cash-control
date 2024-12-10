import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TransactionContext = createContext({});

export const TRANSACTION_TYPES = {
    ENTRADA: 'entrada',
    SAIDA: 'saida'
};

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const result = await window.api.getTransactions();
            setTransactions(result);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const result = await window.api.getCategories();
            setCategories(result);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    }, []);

    const createTransaction = useCallback(async (data) => {
        try {
            const result = await window.api.createTransaction(data);
            await fetchTransactions(); // Atualiza a lista após criar
            return result;
        } catch (error) {
            console.error('Erro ao criar transação:', error);
            throw error;
        }
    }, [fetchTransactions]);

    const createCategory = useCallback(async (name) => {
        try {
            const result = await window.api.createCategory(name);
            await fetchCategories();
            return result;
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            throw error;
        }
    }, [fetchCategories]);

    // NOVO: Efeito para carregar dados iniciais
    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, [fetchTransactions, fetchCategories]);

    return (
        <TransactionContext.Provider value={{
            transactions,
            categories,
            loading,
            fetchTransactions,
            fetchCategories,
            createTransaction,
            createCategory,
            TRANSACTION_TYPES
        }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction deve ser usado dentro de um TransactionProvider');
    }
    return context;
};