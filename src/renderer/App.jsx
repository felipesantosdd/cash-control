import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionsTable from '../components/TransactionsTable';

const App = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/transactions');
            if (!response.ok) {
                throw new Error('Erro ao buscar transações');
            }
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    valor: Number(formData.valor),
                    tipo: formData.tipo,
                    comentario: formData.comentario
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar transação');
            }

            const savedTransaction = await response.json();
            console.log('Transação salva com sucesso:', savedTransaction);
            setIsFormOpen(false);

            // Atualiza a lista de transações
            fetchTransactions();

        } catch (error) {
            console.error('Erro ao salvar transação:', error);
            alert('Erro ao salvar transação!');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-slate-500">
            <div className="flex justify-between items-center mb-6
            ">
                <h1 className="text-2xl font-bold">Algo ainda esta errado</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Nova Transação
                </button>
            </div>

            {loading ? (
                <div className="text-center p-4">
                    <p>Carregando transações...</p>
                </div>
            ) : (
                <TransactionsTable transactions={transactions} />
            )}

            {isFormOpen && (
                <TransactionForm
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default App;