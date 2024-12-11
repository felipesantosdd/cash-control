import React, { useState, useMemo } from 'react';
import { capitalizeText } from '../utils/stringUtils';
import { Switch, Fab } from '@mui/material';
import { useTransaction } from '../context/TransactionContext';
import AddIcon from '@mui/icons-material/Add';

const MONTHS = [
 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const CollapsibleTable = ({ 
 transactions, 
 categories,
 onAddClick
}) => {
 const [openMonth, setOpenMonth] = useState(null);
 const [openCategories, setOpenCategories] = useState(new Set());
 const { updatedTransaction, currentYear, handleYearChange } = useTransaction();

 // Cálculo do balanço mensal
 const monthlyBalances = useMemo(() => {
   const balances = Array(12).fill(0);
   
   transactions?.forEach(transaction => {
     const date = new Date(transaction.maturity);
     const month = date.getMonth();
     const value = Number(transaction.valor);
     
     if (transaction.tipo === 'entrada') {
       balances[month] += value;
     } else {
       balances[month] -= value;
     }
   });

   return balances;
 }, [transactions]);

 const totalBalance = monthlyBalances.reduce((acc, curr) => acc + curr, 0);

 const getBalanceClass = (value) => {
   return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-500';
 };

 const formatCurrency = (value) => {
   return value === 0 ? '-' : `R$ ${Math.abs(value).toFixed(2)}`;
 };

 const handlePaymentUpdate = async (transactionId, newPayStatus) => {
   await updatedTransaction(transactionId, {pay:newPayStatus})
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

 const toggleCategory = (monthIndex, categoryName) => {
   if (openMonth !== monthIndex) {
     setOpenMonth(monthIndex);
     setOpenCategories(new Set([categoryName]));
   } else {
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
       <tr className="border-b bg-[#1F1D2C]">
         <td className="p-4 text-[#B9042C] font-medium">{row.categoryName}</td>
         {row.monthlyValues.map((value, index) => (
           <td key={index} className="p-4 text-[#B9042C] text-right">
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
         <td className="p-4 text-[#B9042C] text-right font-bold">
           R$ {row.yearTotal.toFixed(2)}
         </td>
       </tr>
       {openMonth !== null && isExpanded(openMonth) && row.monthlyTransactions[openMonth].length > 0 && (
         <tr>
           <td colSpan={14} className="bg-[#1F1D2C]">
             <div className="p-4 text-[#B9042C] ">
               <h6 className="font-bold mb-4">
                 Transações de {MONTHS[openMonth]}
               </h6>
               <table className="w-full">
                 <thead >
                   <tr className="text-left">
                     <th className="p-2 text-[#B9042C]">Tipo</th>
                     <th className="p-2 text-[#B9042C]">Valor</th>
                     <th className="p-2 text-[#B9042C]">Comentário</th>
                     <th className="p-2 text-[#B9042C]">Status</th>
                     <th className="p-2 text-[#B9042C]">Vencimento</th>
                     <th className="p-2 text-[#B9042C]">Pago</th>
                   </tr>
                 </thead>
                 <tbody>
                   {row.monthlyTransactions[openMonth].map((transaction) => {
                     const { className, status } = getTransactionStatus(transaction);
                     return (
                       <tr key={transaction.id} className={`border-t border-[#B9042C] ${className}`}>
                         <td className="p-2 text-[#B9042C]">{capitalizeText(transaction.tipo)}</td>
                         <td className="p-2 text-[#B9042C]">R$ {Number(transaction.valor).toFixed(2)}</td>
                         <td className="p-2 text-[#B9042C]">{transaction.comentario || 'Sem comentário'}</td>
                         <td className="p-2 text-[#B9042C]">{status}</td>
                         <td className="p-2 text-[#B9042C]">
                           {new Date(transaction.maturity).toLocaleDateString('pt-BR')}
                         </td>
                         <td className="p-2 text-[#B9042C]">
                           <Switch
                             checked={transaction.pay}
                             onChange={(e) => handlePaymentUpdate(transaction.id, e.target.checked)}
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
   <div className="space-y-4 relative min-h-screen">
     <div className="flex items-center justify-center space-x-4 py-4 bg-[#1F1D2C] rounded-lg shadow-sm">
       <button
         onClick={() => handleYearChange('prev')}
         className="p-2 text-[#B9042C] hover:bg-gray-100 rounded-full"
       >
         <svg
           className="w-6 h-6"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
         >
           <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth={2}
             d="M15 19l-7-7 7-7"
           />
         </svg>
       </button>
       <h2 className="text-2xl font-bold text-[#B9042C]">{currentYear}</h2>
       <button
         onClick={() => handleYearChange('next')}
         className="p-2 text-[#B9042C] hover:bg-gray-100 rounded-full"
       >
         <svg
           className="w-6 h-6"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
         >
           <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth={2}
             d="M9 5l7 7-7 7"
           />
         </svg>
       </button>
     </div>
     
     {!transactions?.length ? (
       <div className="bg-[#1F1D2C] rounded-lg shadow-sm p-8">
         <div className="flex flex-col items-center justify-center text-gray-500">
           <p className="text-lg text-[]">Nenhuma transação encontrada para {currentYear}</p>
         </div>
       </div>
     ) : (
       <div className="overflow-x-auto">
         <table className="w-full border-collapse border-[#B9042C] bg-[#1F1D2C]">
           <thead>
             <tr className="bg-[#1F1D2C]">
               <th className="p-4 text-[#B9042C] text-left">Categoria</th>
               {MONTHS.map(month => (
                 <th key={month} className="p-4 text-[#B9042C] text-right">{month}</th>
               ))}
               <th className="p-4 text-[#B9042C] text-right">Total Anual</th>
             </tr>
           </thead>
           <tbody>
             {groupedData.map((row) => (
               <Row key={row.categoryName} row={row} />
             ))}
             {/* Linha de separação */}
             <tr className="border-t-2 border-[#B9042C]">
               <td colSpan={14} className="p-2 text-[#B9042C]"></td>
             </tr>
             {/* Linha do balanço */}
             <tr className="bg-[#1F1D2C] font-medium">
               <td className="p-4 text-[#B9042C] text-left">Balanço Mensal</td>
               {monthlyBalances.map((balance, index) => (
                 <td key={index} className="p-4 text-[#B9042C] text-right">
                   <span className={getBalanceClass(balance)}>
                     {formatCurrency(balance)}
                   </span>
                 </td>
               ))}
               <td className="p-4 text-[#B9042C] text-right font-bold">
                 <span className={getBalanceClass(totalBalance)}>
                   {formatCurrency(totalBalance)}
                 </span>
               </td>
             </tr>
           </tbody>
         </table>
       </div>
     )}
   </div>
 );
};

export default CollapsibleTable;