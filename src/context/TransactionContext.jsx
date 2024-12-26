import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const TransactionContext = createContext({});

export const TRANSACTION_TYPES = {
  ENTRADA: "entrada",
  SAIDA: "saida",
};

export const TransactionProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (year) => {
    try {
      const data = await window.api.getTransactionsByYear(year);
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const result = await window.api.getCategories();
      setCategories(result);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, []);

  const createTransaction = useCallback(
    async (data) => {
      try {
        const result = await window.api.createTransaction(data);
        await fetchTransactions(currentYear); // Corrija currentDate para currentYear
        return result;
      } catch (error) {
        console.error("Erro ao criar transação:", error);
        throw error;
      }
    },
    [fetchTransactions, currentYear]
  ); // Adicione currentYear às dependências

  const createCategory = useCallback(
    async (name) => {
      try {
        const result = await window.api.createCategory(name);
        await fetchCategories();
        return result;
      } catch (error) {
        console.error("Erro ao criar categoria:", error);
        throw error;
      }
    },
    [fetchCategories]
  );

  const updatedTransaction = useCallback(
    async (id, data) => {
      try {
        const result = await window.api.updateTransaction(id, data);
        await fetchTransactions(currentYear);
        return result;
      } catch (error) {
        console.error("Erro ao criar transação:", error);
        throw error;
      }
    },
    [fetchTransactions]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      try {
        const result = await window.api.deleteTransaction(id);
        await fetchTransactions(currentYear);
        return result;
      } catch (error) {
        console.error("Erro ao deletar transação:", error);
        throw error;
      }
    },
    [fetchTransactions]
  );

  const handleYearChange = (direction) => {
    const newYear = direction === "next" ? currentYear + 1 : currentYear - 1;
    setCurrentYear(newYear);
  };

  const openLink = (url) => {
    if (!url) return;
    window.api.openExternal(url).catch((error) => {
      console.error("Erro ao abrir link:", error);
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchTransactions(currentYear);
        await fetchCategories();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentYear]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        loading,
        fetchTransactions,
        fetchCategories,
        createTransaction,
        createCategory,
        updatedTransaction,
        currentYear,
        handleYearChange,
        deleteTransaction,
        TRANSACTION_TYPES,
        openLink,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransaction deve ser usado dentro de um TransactionProvider"
    );
  }
  return context;
};
