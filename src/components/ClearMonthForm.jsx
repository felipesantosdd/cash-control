import React, { useState, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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

const ClearMonthForm = ({ open, onClose, onSubmit, transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState({
    month: false,
  });

  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach((transaction) => {
      const date = new Date(transaction.maturity);
      months.add(date.getMonth());
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [transactions]);

  const monthTransactionsCount = useMemo(() => {
    if (selectedMonth === "") return 0;
    return transactions.filter((transaction) => {
      const date = new Date(transaction.maturity);
      return date.getMonth() === selectedMonth;
    }).length;
  }, [selectedMonth, transactions]);

  const handleSubmit = () => {
    if (selectedMonth === "") {
      setErrors((prev) => ({ ...prev, month: true }));
      return;
    }

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    onSubmit({
      month: selectedMonth,
    });
    handleClose();
  };

  const handleClose = () => {
    setSelectedMonth("");
    setConfirmDelete(false);
    setErrors({ month: false });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: "#1F1D2C",
          color: "white",
          minWidth: "400px",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#A0052B",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <DeleteIcon /> Limpar Transações do Mês
      </DialogTitle>
      <DialogContent>
        {!confirmDelete ? (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel
              sx={{
                color: "#A00935 !important",
                "&.Mui-focused": { color: "#A00935 !important" },
              }}
            >
              Selecione o Mês
            </InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setErrors((prev) => ({ ...prev, month: false }));
              }}
              label="Selecione o Mês"
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#171520",
                  },
                },
              }}
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#A00935",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#A00935",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#A00935",
                },
                "& .MuiSvgIcon-root": { color: "#A00935" },
              }}
            >
              {availableMonths.map((monthIndex) => (
                <MenuItem
                  key={monthIndex}
                  value={monthIndex}
                  sx={{
                    color: "white",
                    backgroundColor: "#171520",
                    "&:hover": { backgroundColor: "#0D0C13" },
                    "&.Mui-selected": {
                      backgroundColor: "#A00935",
                      "&:hover": { backgroundColor: "#A0052B" },
                    },
                  }}
                >
                  {MONTHS[monthIndex]}
                </MenuItem>
              ))}
            </Select>
            {errors.month && (
              <FormHelperText error>
                Por favor, selecione um mês.
              </FormHelperText>
            )}
          </FormControl>
        ) : (
          <div className="mt-4">
            <Typography variant="body1" sx={{ color: "#fff", mb: 2 }}>
              Você está prestes a excluir todas as transações de{" "}
              {MONTHS[selectedMonth]}.
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff", mb: 2 }}>
              Total de transações que serão excluídas:{" "}
              <strong>{monthTransactionsCount}</strong>
            </Typography>
            <Typography variant="body1" sx={{ color: "#f44336" }}>
              Esta ação não poderá ser desfeita. Deseja continuar?
            </Typography>
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="error">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
        >
          {confirmDelete ? "Confirmar Exclusão" : "Próximo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClearMonthForm;
