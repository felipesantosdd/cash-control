import React, { createContext, useContext, useState, useCallback } from 'react';

const TransactionContext = createContext({});

export const TRANSACTION_TYPES = {
    ENTRADA: 'entrada',
    SAIDA: 'saida'
};

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/transactions');
            if (!response.ok) throw new Error('Erro ao buscar transações');

            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    }, []);


    const createTransaction = useCallback(async (transactionData) => {
        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    valor: Number(transactionData.valor),
                    tipo: transactionData.tipo,
                    comentario: transactionData.comentario
                })
            });

            if (!response.ok) throw new Error('Erro ao salvar transação');

            const savedTransaction = await response.json();
        
            await fetchTransactions();
            return savedTransaction;
        } catch (error) {
            console.error('Erro ao criar transação:', error);
            throw error;
        }
    }, [fetchTransactions]);


    const calculateBalance = useCallback(() => {
        return transactions.reduce((acc, transaction) => {
            const valor = Number(transaction.valor);
            return transaction.tipo === TRANSACTION_TYPES.ENTRADA
                ? acc + valor
                : acc - valor;
        }, 0);
    }, [transactions]);


    const value = {
        transactions,
        loading,
        fetchTransactions,
        createTransaction,
        calculateBalance,
        TRANSACTION_TYPES
    };

    return (
        <TransactionContext.Provider value={value}>
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