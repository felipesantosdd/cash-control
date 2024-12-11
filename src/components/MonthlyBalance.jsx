import { useMemo } from "react";

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

const MonthlyBalance = ({ transactions }) => {
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
      if (value === 0) return 'text-gray-500';
      return value > 0 ? 'text-green-600' : 'text-red-600';
    };
  
    const formatCurrency = (value) => {
      return value === 0 ? '-' : `R$ ${Math.abs(value).toFixed(2)}`;
    };
  
    return (
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left font-medium text-gray-700">
                Balanço Mensal
              </th>
              {MONTHS.map(month => (
                <th key={month} className="p-4 text-right"></th>
              ))}
              <th className="p-4 text-right">Total Anual</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4 text-left">Saldo</td>
              {monthlyBalances.map((balance, index) => (
                <td 
                  key={index} 
                  className={`p-4 text-right font-medium ${getBalanceClass(balance)}`}
                >
                  <span className={balance < 0 ? 'text-red-600' : 'text-green-600'}>
                    {balance < 0 ? '-' : ''}
                    {formatCurrency(balance)}
                  </span>
                </td>
              ))}
              <td 
                className={`p-4 text-right font-bold ${getBalanceClass(totalBalance)}`}
              >
                <span className={totalBalance < 0 ? 'text-red-600' : 'text-green-600'}>
                  {totalBalance < 0 ? '-' : ''}
                  {formatCurrency(totalBalance)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  

  
  export default MonthlyBalance;