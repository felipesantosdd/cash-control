import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionsTable from '../components/TransactionsTable';
import AddIcon from '@mui/icons-material/Add';
import { useTransaction } from '../context/TransactionContext';
import { Fab } from '@mui/material';

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
        <div className="min-h-screen bg-gradient-to-b from-[#0D0C13] to-[#171520]">
            <div className="p-6 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className='flex flex-row justify-center w-full text-center'>
                        <h1 className="text-2xl font-bold text-[#A0052B]">CashControl</h1>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center p-4 text-white">
                        <p>Carregando transações...</p>
                    </div>
                ) : (
                    <TransactionsTable 
                        transactions={transactions} 
                        categories={categories} 
                    />
                )}

                {isFormOpen && (
                    <TransactionForm
                        onClose={() => setIsFormOpen(false)}
                        onSubmit={handleSubmit}
                    />
                )}

                    <div  onClick={() => setIsFormOpen(true)} style={{ marginTop:'10px', display:'flex', flexDirection:'row-reverse', padding:'10px', position:'fixed', bottom:'0', right:'10px'}}>
                        <Fab 
                            style={{backgroundColor:'#9F0049'}}
                            aria-label="add">
                            <AddIcon />
                        </Fab>
                    </div>
            </div>
        </div>
    );
};

export default App;