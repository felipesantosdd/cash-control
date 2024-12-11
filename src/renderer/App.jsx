import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionsTable from '../components/TransactionsTable';
import { useTransaction } from '../context/TransactionContext';


const App = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const {
        loading,
        transactions,
        categories,
        createTransaction,

    } = useTransaction();
        

    const handleSubmit = async (formData) => {
        try {
            await createTransaction(formData); 
            setIsFormOpen(false);
        } catch (error) {
            alert('Erro ao salvar transação!');
        }
    };

    return (
        <div className="p-6  mx-auto bg-[#1B212C] h-full w-full">
            <div className="flex justify-between items-center mb-6
            ">
                <h1 className="text-2xl font-bold">teste?</h1>
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
                    <TransactionsTable transactions={transactions} categories={categories} />
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