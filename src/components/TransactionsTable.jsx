import React, { useState, useMemo } from 'react';
import { capitalizeText } from '../utils/stringUtils';
import { Switch } from '@mui/material';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const CollapsibleTable = ({ transactions, categories, onUpdatePayment }) => {
  // Estado global para controlar qual mês está aberto
  const [openMonth, setOpenMonth] = useState(null);
  // Estado para controlar quais categorias estão abertas no mês selecionado
  const [openCategories, setOpenCategories] = useState(new Set());

  const handlePaymentUpdate = async (transactionId, newPayStatus) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pay: newPayStatus }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o status do pagamento');
      }

      if (onUpdatePayment) {
        onUpdatePayment(transactionId, newPayStatus);
      }
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error);
    }
  };

  const getTransactionStatus = (transaction) => {
    const now = new Date();
    const maturityDate = new Date(transaction.maturity);
    
    if (transaction.pay) {
      return {
        className: 'bg-green-100',
        status: 'Pago'
      };
    }
    
    if (maturityDate < now) {
      return {
        className: 'bg-red-100',
        status: 'Atrasado'
      };
    }
    
    return {
      className: 'bg-gray-50',
      status: 'Pendente'
    };
  };

  const groupedData = useMemo(() => {
    const result = categories?.map(category => {
      const categoryTransactions = transactions.filter(
        transaction => transaction.category_id === category.id
      );

      const monthlyValues = Array(12).fill(0);
      const monthlyTransactions = Array(12).fill().map(() => []);
      
      categoryTransactions.forEach(transaction => {
        const date = new Date(transaction.maturity);
        const month = date.getMonth();
        monthlyValues[month] += Number(transaction.valor);
        monthlyTransactions[month].push(transaction);
      });

      const yearTotal = monthlyValues.reduce((acc, curr) => acc + curr, 0);

      return {
        categoryName: category.name,
        monthlyValues,
        monthlyTransactions,
        yearTotal
      };
    });

    return result || [];
  }, [transactions, categories]);

  // Função para alternar a expansão de uma categoria em um mês específico
  const toggleCategory = (monthIndex, categoryName) => {
    if (openMonth !== monthIndex) {
      // Se está abrindo um novo mês, limpa todas as categorias abertas anteriormente
      setOpenMonth(monthIndex);
      setOpenCategories(new Set([categoryName]));
    } else {
      // Se está no mesmo mês, apenas alterna a categoria
      const newOpenCategories = new Set(openCategories);
      if (newOpenCategories.has(categoryName)) {
        newOpenCategories.delete(categoryName);
        if (newOpenCategories.size === 0) {
          setOpenMonth(null);
        }
      } else {
        newOpenCategories.add(categoryName);
      }
      setOpenCategories(newOpenCategories);
    }
  };

  const Row = ({ row }) => {
    const isExpanded = (monthIndex) => {
      return openMonth === monthIndex && openCategories.has(row.categoryName);
    };

    return (
      <>
        <tr className="border-b">
          <td className="p-4 font-medium">{row.categoryName}</td>
          {row.monthlyValues.map((value, index) => (
            <td key={index} className="p-4 text-right">
              {value > 0 ? (
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => toggleCategory(index, row.categoryName)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${isExpanded(index) ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <span>R$ {value.toFixed(2)}</span>
                </div>
              ) : '-'}
            </td>
          ))}
          <td className="p-4 text-right font-bold">
            R$ {row.yearTotal.toFixed(2)}
          </td>
        </tr>
        {openMonth !== null && isExpanded(openMonth) && row.monthlyTransactions[openMonth].length > 0 && (
          <tr>
            <td colSpan={14} className="bg-gray-50">
              <div className="p-4">
                <h6 className="font-bold mb-4">
                  Transações de {MONTHS[openMonth]}
                </h6>
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Tipo</th>
                      <th className="p-2">Valor</th>
                      <th className="p-2">Comentário</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Vencimento</th>
                      <th className="p-2">Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.monthlyTransactions[openMonth].map((transaction) => {
                      const { className, status } = getTransactionStatus(transaction);
                      return (
                        <tr key={transaction.id} className={`border-t ${className}`}>
                          <td className="p-2">{capitalizeText(transaction.tipo)}</td>
                          <td className="p-2">R$ {Number(transaction.valor).toFixed(2)}</td>
                          <td className="p-2">{transaction.comentario || 'Sem comentário'}</td>
                          <td className="p-2">{status}</td>
                          <td className="p-2">
                            {new Date(transaction.maturity).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-2">
                            <Switch
                              checked={transaction.pay}
                              onCheckedChange={(checked) => handlePaymentUpdate(transaction.id, checked)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-4 text-left">Categoria</th>
            {MONTHS.map(month => (
              <th key={month} className="p-4 text-right">{month}</th>
            ))}
            <th className="p-4 text-right">Total Anual</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((row) => (
            <Row key={row.categoryName} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollapsibleTable;