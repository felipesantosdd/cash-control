import React, { useState, useMemo, useEffect } from "react";
import { capitalizeText } from "../utils/stringUtils";
import { Switch, Fab } from "@mui/material";
import { useTransaction } from "../context/TransactionContext";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import TransactionForm from "./TransactionForm";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const expand = {
  transition: "all 0.3s ease-in-out;",
};

const CollapsibleTable = ({ transactions, categories, onAddClick }) => {
  const [openMonth, setOpenMonth] = useState(null);
  const [expandedMonths, setExpandedMonths] = useState(new Set());
  const [openCategories, setOpenCategories] = useState(new Set());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");
  const [visibleContent, setVisibleContent] = useState(new Map());
  const {
    updatedTransaction,
    currentYear,
    handleYearChange,
    deleteTransaction,
    openLink,
  } = useTransaction();

  const formatarValorMonetario = (valor) => {
    const numero = Number(valor);
    if (isNaN(numero)) return "0,00";

    return new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero);
  };
  const handleRowClick = (transactionId) => {
    setSelectedRowId(transactionId === selectedRowId ? null : transactionId);
  };

  const handleMonthClick = (monthIndex) => {
    const newExpandedMonths = new Set(expandedMonths);
    if (newExpandedMonths.has(monthIndex)) {
      newExpandedMonths.delete(monthIndex);
      setOpenMonth(null);
      setOpenCategories(new Set());
    } else {
      newExpandedMonths.add(monthIndex);
      setOpenMonth(monthIndex);

      const categoriesToExpand = new Set(
        groupedData
          .filter((row) => row.monthlyTransactions[monthIndex].length > 0)
          .map((row) => row.categoryName)
      );
      setOpenCategories(categoriesToExpand);
    }
    setExpandedMonths(newExpandedMonths);
  };

  const getSortedTransactions = (transactions) => {
    return [...transactions].sort((a, b) => {
      const comparison = Number(b.valor) - Number(a.valor);
      return sortDirection === "desc" ? comparison : -comparison;
    });
  };

  const monthlyBalances = useMemo(() => {
    const balances = Array(12).fill(0);

    transactions?.forEach((transaction) => {
      const date = new Date(transaction.maturity);
      const month = date.getMonth();
      const value = Number(transaction.valor);

      if (transaction.tipo === "entrada") {
        balances[month] += value;
      } else {
        balances[month] -= value;
      }
    });

    return balances;
  }, [transactions]);

  const totalBalance = monthlyBalances.reduce((acc, curr) => acc + curr, 0);

  const handleEditSubmit = async (editedData) => {
    try {
      await updatedTransaction(editedData.id, editedData);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
    }
  };

  const getBalanceClass = (value) => {
    return value > 0
      ? "text-green-600"
      : value < 0
      ? "text-red-600"
      : "text-gray-500";
  };

  useEffect(() => {
    console.log(editingTransaction);
  }, [editingTransaction]);

  const formatCurrency = (value) => {
    return value === 0 ? "-" : `R$ ${formatarValorMonetario(value)}`;
  };

  const handlePaymentUpdate = async (transactionId, newPayStatus) => {
    await updatedTransaction(transactionId, { pay: newPayStatus });
  };

  const getTransactionStatus = (transaction) => {
    const now = new Date();
    const maturityDate = new Date(transaction.maturity);

    if (transaction.pay) {
      return {
        className: "bg-[#1A2433] text-[#28A44B]",
        status: "Pago",
      };
    }

    if (maturityDate < now) {
      return {
        className: "bg-[#2D1619] text-[#A0062D]",
        status: "Atrasado",
      };
    }

    return {
      className: "bg-[#1F1D2C] text-[#38BDF8]",
      status: "Pendente",
    };
  };

  const groupedData = useMemo(() => {
    const result = categories?.map((category) => {
      const categoryTransactions = transactions.filter(
        (transaction) => transaction.category_id === category.id
      );

      const monthlyValues = Array(12).fill(0);
      const monthlyTransactions = Array(12)
        .fill()
        .map(() => []);

      categoryTransactions.forEach((transaction) => {
        const date = new Date(transaction.maturity);
        const month = date.getMonth();
        monthlyValues[month] += Number(transaction.valor);
        monthlyTransactions[month].push(transaction);
      });

      monthlyTransactions.forEach((transactions, index) => {
        transactions.sort((a, b) => {
          const comparison = Number(b.valor) - Number(a.valor);
          return sortDirection === "desc" ? comparison : -comparison;
        });
      });

      const yearTotal = monthlyValues.reduce((acc, curr) => acc + curr, 0);

      return {
        categoryName: category.name,
        monthlyValues,
        monthlyTransactions,
        yearTotal,
      };
    });

    return (result || []).sort((a, b) => {
      if (a.categoryName === "Recursos") return -1;
      if (b.categoryName === "Recursos") return 1;
      return a.categoryName.localeCompare(b.categoryName);
    });
  }, [transactions, categories, sortDirection]);

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

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const Row = ({ row }) => {
    const isRecursos = row.categoryName === "Recursos";

    const getValueColor = (transactions, value) => {
      if (value === 0) return "text-[#E9E5E6]";

      if (isRecursos) return "text-green-500";

      if (transactions.length === 0) return "text-[#E9E5E6]";

      const now = new Date();
      const hasUnpaidOverdue = transactions.some((t) => {
        const maturityDate = new Date(t.maturity);
        return !t.pay && maturityDate < now;
      });

      const allPaid = transactions.every((t) => t.pay);

      if (hasUnpaidOverdue) return "text-[#A0062D] font-bold";
      if (allPaid) return "text-[#28A44B]";
      return "text-[#E9E5E6]";
    };

    const isExpanded = (monthIndex) => {
      return (
        openMonth === monthIndex &&
        (openCategories.has(row.categoryName) || expandedMonths.has(monthIndex))
      );
    };

    return (
      <>
        <tr
          className={`border-b bg-[#1F1D2C] ${
            isRecursos ? "bg-opacity-90" : ""
          }`}
        >
          <td className={`p-4 text-[#E9E5E6] font-medium`}>
            {row.categoryName}
          </td>
          {row.monthlyValues.map((value, index) => (
            <td
              key={index}
              className={`p-4 text-right ${
                openMonth === index ? "bg-[#1E293B]" : ""
              }`}
            >
              {value > 0 ? (
                <div className="flex items-center justify-end space-x-2">
                  <span
                    className={getValueColor(
                      row.monthlyTransactions[index],
                      value
                    )}
                  >
                    R$ {formatarValorMonetario(value)}
                  </span>
                  <button
                    onClick={() => toggleCategory(index, row.categoryName)}
                    className={`p-1 hover:bg-gray-100 rounded-full ${getValueColor(
                      row.monthlyTransactions[index],
                      value
                    )}`}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isExpanded(index) ? "rotate-180" : ""
                      }`}
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
                </div>
              ) : (
                <span className="text-[#E9E5E6]">-</span>
              )}
            </td>
          ))}
          <td className="p-4 text-[#E9E5E6] text-right font-bold">
            R$ {formatarValorMonetario(row.yearTotal)}
          </td>
        </tr>
        {openMonth !== null &&
          isExpanded(openMonth) &&
          row.monthlyTransactions[openMonth].length > 0 && (
            <tr>
              <td colSpan={14} className="bg-[#1F1D2C]">
                <div
                  className={`
        overflow-hidden transition-all duration-300 ease-in-out
        transform origin-top
        ${isExpanded ? "animate-expand max-h-96" : "animate-collapse max-h-0"}
      `}
                >
                  <div className="p-4 bg-slate-800 text-[#E9E5E6]">
                    <h6 className="font-bold mb-4">
                      {row.categoryName === "Recursos"
                        ? `${row.categoryName} obtidos em ${MONTHS[openMonth]}`
                        : `Gastos de ${MONTHS[openMonth]} com ${row.categoryName}`}
                    </h6>
                    <table className="w-full">
                      <thead>
                        <tr className="text-left">
                          <th className="p-2 text-[#E9E5E6]">Tipo</th>
                          <th className="p-2 text-[#E9E5E6]">Comentário</th>
                          <th
                            className="p-2 text-[#E9E5E6] cursor-pointer"
                            onClick={toggleSortDirection}
                          >
                            Valor {sortDirection === "desc" ? "↓" : "↑"}
                          </th>

                          <th className="p-2 text-[#E9E5E6]">Status</th>
                          <th className="p-2 text-[#E9E5E6]">Vencimento</th>
                          <th className="p-2 text-[#E9E5E6]">Pago</th>
                          <th className="p-2 text-[#E9E5E6] text-center  justify-center align-middle w-[100px]">
                            Ação
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedTransactions(
                          row.monthlyTransactions[openMonth]
                        ).map((transaction) => {
                          const { className, status } =
                            getTransactionStatus(transaction);
                          return (
                            <tr
                              key={transaction.id}
                              className={`border-t border-[#B9042C] ${className} cursor-pointer 
    ${selectedRowId === transaction.id ? "bg-blue-900 bg-opacity-50" : ""} 
    hover:bg-blue-900 hover:bg-opacity-30 transition-colors duration-200`}
                            >
                              <td className={`p-2`}>
                                {capitalizeText(transaction.tipo)}
                              </td>
                              <td className={`p-2`}>
                                {transaction.comentario || "Sem comentário"}
                              </td>
                              <td className={`p-2`}>
                                {formatCurrency(Number(transaction.valor))}
                              </td>
                              <td className={`p-2`}>{status}</td>
                              <td className="p-2">
                                {new Date(
                                  Date.parse(transaction.maturity) +
                                    12 * 60 * 60 * 1000
                                ).toLocaleDateString("pt-BR")}
                              </td>
                              <td className={`p-2`}>
                                <div className="switch-container">
                                  <Switch
                                    checked={!!transaction.pay}
                                    onChange={(e) =>
                                      handlePaymentUpdate(
                                        transaction.id,
                                        e.target.checked
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td
                                className={`p-1 flex justify-center items-center  w-[150px] h-[50px] `}
                              >
                                <div className="delete-container">
                                  <DeleteIcon
                                    style={{
                                      margin: "0 10px",
                                      cursor: "pointer",
                                    }}
                                    color="error"
                                    onClick={() =>
                                      deleteTransaction(transaction.id)
                                    }
                                  />

                                  <EditIcon
                                    style={{
                                      margin: "0 10px",
                                      cursor: "pointer",
                                    }}
                                    color="error"
                                    onClick={() =>
                                      setEditingTransaction(transaction)
                                    }
                                  />

                                  <LinkIcon
                                    style={{
                                      margin: "0 10px",
                                      cursor: "pointer",
                                    }}
                                    color={
                                      transaction.link ? "error" : "disabled"
                                    }
                                    onClick={() => openLink(transaction.link)}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
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
          onClick={() => handleYearChange("prev")}
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
          onClick={() => handleYearChange("next")}
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
            <p className="text-lg text-[]">
              Nenhuma transação encontrada para {currentYear}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto  rounded-lg">
          <table className="w-full border-collapse border-[#B9042C] bg-[#1F1D2C]">
            <thead>
              <tr className="bg-[#1F1D2C] ">
                <th className="p-4 text-[#E9E5E6] text-left">Categoria</th>
                {MONTHS.map((month, index) => (
                  <th
                    key={month}
                    className={`p-4 text-[#E9E5E6] text-right cursor-pointer ${
                      openMonth === index ? "bg-[#1E293B]" : ""
                    } hover:bg-[#2a2839]`}
                    onClick={() => handleMonthClick(index)}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span>{month}</span>
                      {expandedMonths.has(index) ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
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
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-4 text-[#E9E5E6] text-right">Total Anual</th>
              </tr>
            </thead>
            <tbody>
              {groupedData.map((row) => (
                <Row key={row.categoryName} row={row} />
              ))}
              <tr className="border-t-2 border-[#B9042C]">
                <td colSpan={14} className={` text-[#E9E5E6] `}></td>
              </tr>
              <tr className="bg-[#1F1D2C] font-medium">
                <td className="p-4 text-[#E9E5E6] text-left">Balanço Mensal</td>
                {monthlyBalances.map((balance, index) => (
                  <td
                    key={index}
                    className={`p-4 text-[#E9E5E6] text-right ${
                      openMonth === index ? "bg-[#1E293B]" : ""
                    }`}
                  >
                    <span className={getBalanceClass(balance)}>
                      {formatCurrency(balance)}
                    </span>
                  </td>
                ))}
                <td className="p-4 text-[#E9E5E6] text-right font-bold ">
                  <span className={getBalanceClass(totalBalance)}>
                    {formatCurrency(totalBalance)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {editingTransaction && (
        <TransactionForm
          initialData={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default CollapsibleTable;
