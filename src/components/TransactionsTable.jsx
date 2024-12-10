import React from 'react';
import { useTransaction } from '../context/TransactionContext';

const TransactionsTable = ({ transactions }) => {
    const { categories } = useTransaction(); // NOVO: Obtém categorias do contexto

    if (!transactions.length) {
        return (
            <div className="text-center p-4">
                <p>Nenhuma transação encontrada.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Data</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Valor</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Tipo</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Categoria</th> {/* NOVO */}
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Comentário</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => {
                        // NOVO: Encontra a categoria da transação
                        const category = categories.find(cat => cat.id === transaction.category_id);

                        return (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`font-medium ${transaction.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                                        R$ {Number(transaction.valor).toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${transaction.tipo === 'entrada'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {transaction.tipo}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500"> {/* NOVO */}
                                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                                        {category?.name || 'Sem categoria'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {transaction.comentario}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsTable;