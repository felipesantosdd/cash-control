import React, { useState, useMemo } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
} from "@mui/material";
import dayjs from "dayjs";

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

const CloneTransactionsForm = ({ open, onClose, onSubmit, transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [targetDate, setTargetDate] = useState(null);
  const [errors, setErrors] = useState({
    month: false,
    date: false,
  });

  // Computar meses que têm transações
  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach((transaction) => {
      const date = new Date(transaction.maturity);
      months.add(date.getMonth());
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [transactions]);

  const handleSubmit = () => {
    let hasErrors = false;

    if (selectedMonth === "") {
      setErrors((prev) => ({ ...prev, month: true }));
      hasErrors = true;
    }

    if (!targetDate) {
      setErrors((prev) => ({ ...prev, date: true }));
      hasErrors = true;
    }

    if (!hasErrors) {
      onSubmit({
        sourceMonth: selectedMonth,
        targetDate: dayjs(targetDate).format("YYYY-MM-DD"),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedMonth("");
    setTargetDate(null);
    setErrors({ month: false, date: false });
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
      <DialogTitle sx={{ color: "#A0052B" }}>Clonar Transações</DialogTitle>
      <DialogContent>
        {/* Seleção de Mês */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel
            sx={{
              color: "#A00935 !important",
              "&.Mui-focused": { color: "#A00935 !important" },
            }}
          >
            Mês de Origem
          </InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setErrors((prev) => ({ ...prev, month: false }));
            }}
            label="Mês de Origem"
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
              Por favor, selecione o mês de origem.
            </FormHelperText>
          )}
        </FormControl>

        {/* Seleção de Data de Destino */}
        <FormControl fullWidth sx={{ mt: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data de Destino"
              value={targetDate}
              onChange={(newValue) => {
                setTargetDate(newValue);
                setErrors((prev) => ({
                  ...prev,
                  date: false,
                  dateMessage: "",
                }));
              }}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  error: errors.date,
                  helperText: errors.date
                    ? "Por favor, selecione a data de destino."
                    : "",
                },
              }}
            />
          </LocalizationProvider>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="error">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: "#A0052B",
            "&:hover": { bgcolor: "#800424" },
          }}
        >
          Clonar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloneTransactionsForm;
