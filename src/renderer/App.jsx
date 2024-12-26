import React, { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionsTable from "../components/TransactionsTable";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import CloneTransactionsForm from "../components/CloneTransactionsForm";
import { useTransaction } from "../context/TransactionContext";
import { Button, Fab } from "@mui/material";
import ClearMonthForm from "../components/ClearMonthForm";

const App = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isClearMonthModalOpen, setIsClearMonthModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const {
    loading,
    transactions,
    categories,
    createTransaction,
    deleteTransaction,
  } = useTransaction();

  const handleSubmit = async (formData) => {
    try {
      await createTransaction(formData);
    } catch (error) {
      alert("Erro ao salvar transação!");
    }
  };

  const handleClearMonth = async ({ month }) => {
    try {
      const monthTransactions = transactions.filter((transaction) => {
        const date = new Date(transaction.maturity);
        return date.getMonth() === month;
      });

      for (const transaction of monthTransactions) {
        await deleteTransaction(transaction.id);
      }

      setIsClearMonthModalOpen(false);
    } catch (error) {
      console.error("Erro ao limpar transações do mês:", error);
    }
  };

  const handleCloneTransactions = async ({ sourceMonth, targetDate }) => {
    try {
      const sourceTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.maturity);
        return transactionDate.getMonth() === sourceMonth;
      });

      const clonedTransactions = sourceTransactions.map((transaction) => {
        const oldDate = new Date(transaction.maturity);
        const newDate = new Date(targetDate);

        newDate.setDate(oldDate.getDate());

        return {
          valor: transaction.valor,
          tipo: transaction.tipo,
          category_id: transaction.category_id,
          comentario: transaction.comentario,
          maturity: newDate.toISOString().split("T")[0],
          pay: false,
        };
      });

      for (const transaction of clonedTransactions) {
        await createTransaction(transaction);
      }

      setIsCloneModalOpen(false);
    } catch (error) {
      console.error("Erro ao clonar transações:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0C13] to-[#171520]">
      <div className="p-6 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-row justify-center w-full text-center">
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

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            position: "fixed",
            bottom: "0",
            right: "10px",
          }}
        >
          {showMenu && (
            <>
              <Fab
                onClick={() => setIsFormOpen(true)}
                style={{ backgroundColor: "#9F0049", marginBottom: "10px" }}
                aria-label="add"
              >
                <AddIcon />
              </Fab>
              <Fab
                onClick={setIsCloneModalOpen}
                style={{ backgroundColor: "#9F0049", marginBottom: "10px" }}
                aria-label="add"
              >
                <ContentCopyIcon />
              </Fab>
              <Fab
                onClick={() => setIsClearMonthModalOpen(true)}
                style={{ backgroundColor: "#9F0049", marginBottom: "10px" }}
                aria-label="add"
              >
                <DeleteIcon />
              </Fab>
              <Fab
                onClick={() => setShowMenu(false)}
                style={{ backgroundColor: "#9F0049", marginBottom: "10px" }}
                aria-label="add"
              >
                <CloseIcon />
              </Fab>
            </>
          )}
          {!showMenu && (
            <Fab
              className="animate-bounce"
              onClick={() => setShowMenu(true)}
              style={{ backgroundColor: "#9F0049", marginBottom: "10px" }}
              aria-label="add"
            >
              <MenuIcon />
            </Fab>
          )}
        </div>
      </div>
      <CloneTransactionsForm
        open={isCloneModalOpen}
        onClose={() => setIsCloneModalOpen(false)}
        onSubmit={handleCloneTransactions}
        transactions={transactions}
      />
      <ClearMonthForm
        open={isClearMonthModalOpen}
        onClose={() => setIsClearMonthModalOpen(false)}
        onSubmit={handleClearMonth}
        transactions={transactions}
      />
    </div>
  );
};

export default App;
