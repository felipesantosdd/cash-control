import React, { useEffect, useState } from "react";
import { useTransaction } from "../context/TransactionContext";
import { capitalizeText } from "../utils/stringUtils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Button,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": { color: "#A00935" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#A00935" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#A00935" },
            "&:hover fieldset": { borderColor: "#A00935" },
            "&.Mui-focused fieldset": { borderColor: "#A00935" },
            "& input": { color: "white" },
          },
        },
      },
    },
  },
});

dayjs.extend(utc);
dayjs.extend(timezone);

const TransactionForm = ({ onClose, onSubmit, initialData }) => {
  const { TRANSACTION_TYPES, categories, fetchCategories, createCategory } =
    useTransaction();

  const [formData, setFormData] = useState({
    valor: initialData?.valor || 0,
    tipo: initialData?.tipo || "saida",
    category_id: initialData?.category_id || "",
    comentario: initialData?.comentario || "",
    maturity: initialData?.maturity || null,
    pay: initialData?.pay || false,
  });

  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [errors, setErrors] = useState({
    valor: false,
    tipo: false,
    category_id: false,
    comentario: false,
    maturity: false,
  });

  const formatarValorMonetario = (valor) => {
    const numero = Number(valor);
    if (isNaN(numero)) return "0,00";

    return new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "valor") {
      // Remove qualquer caractere que não seja número ou vírgula
      const sanitizedValue = value.replace(/[^\d,]/g, "");

      // Garante que só exista uma vírgula
      const parts = sanitizedValue.split(",");
      let formattedValue = parts[0];
      if (parts.length > 1) {
        // Limita a 2 casas decimais
        formattedValue += "," + parts[1].slice(0, 2);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else if (name === "comentario") {
      setFormData((prev) => ({
        ...prev,
        [name]: capitalizeText(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpa o erro do campo se ele for preenchido
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleChangeDate = (newValue) => {
    try {
      // Verifica se é uma data válida
      if (!newValue || !newValue.isValid()) {
        setFormData((prev) => ({
          ...prev,
          maturity: null,
        }));
        return;
      }

      // Cria uma nova data definindo a hora para 12:00 para evitar problemas com timezone
      const adjustedDate = dayjs(newValue)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0);

      // Formata a data para YYYY-MM-DD
      const formattedDate = adjustedDate.format("YYYY-MM-DD");

      setFormData((prev) => ({
        ...prev,
        maturity: formattedDate,
      }));

      setErrors((prev) => ({
        ...prev,
        maturity: false,
      }));
    } catch (error) {
      console.error("Erro ao processar data:", error);
      setFormData((prev) => ({
        ...prev,
        maturity: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    let hasErrors = false;

    if (!formData.valor) {
      setErrors((prev) => ({ ...prev, valor: true }));
      hasErrors = true;
    }

    if (!formData.tipo) {
      setErrors((prev) => ({ ...prev, tipo: true }));
      hasErrors = true;
    }

    if (!formData.category_id) {
      setErrors((prev) => ({ ...prev, category_id: true }));
      hasErrors = true;
    }

    if (!formData.comentario.trim()) {
      setErrors((prev) => ({ ...prev, comentario: true }));
      hasErrors = true;
    }

    if (!formData.maturity) {
      setErrors((prev) => ({ ...prev, maturity: true }));
      hasErrors = true;
    }

    if (!hasErrors) {
      await onSubmit({
        ...formData,
        id: initialData?.id, // Passa o ID se estiver editando
      });
      onClose();
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      if (!newCategory.trim()) {
        return;
      }

      const capitalizedName = capitalizeText(newCategory);
      const category = await createCategory(capitalizedName);

      if (category && category.id) {
        setFormData((prev) => ({ ...prev, category_id: category.id }));
        setNewCategory("");
        setIsAddingCategory(false);
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error("Erro detalhado ao criar categoria:", {
        message: error.message,
        stack: error.stack,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <ThemeProvider theme={theme}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-[#1F1D2C] p-6 rounded-lg w-2/4">
          <h2 className="text-xl mb-4 text-[#A0052B]">Nova Transação</h2>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth className="mb-4">
              {!isAddingCategory ? (
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      color: "#A00935 !important", // Cor padrão
                      "&.Mui-focused": {
                        color: "#A00935 !important", // Cor quando focado
                      },
                      "&.MuiInputLabel-shrink": {
                        color: "#A00935 !important", // Cor quando encolhido
                      },
                      "&.Mui-disabled": {
                        color: "#A00935 !important", // Cor quando desabilitado
                      },
                    }}
                    id="category-select-label"
                  >
                    Categoria
                  </InputLabel>
                  <Select
                    labelId="category-select-label"
                    name="category_id"
                    label="Categoria"
                    value={formData.category_id}
                    onChange={handleChange}
                    defaultValue=""
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: "#171520",
                          "& .MuiMenuItem-root": {
                            "&:focus": {
                              outline: "none",
                              backgroundColor: "transparent",
                            },
                          },
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
                      "& .MuiSvgIcon-root": { color: "#A00935" }, // Cor do ícone de seta
                      "& .MuiSelect-select": { color: "white" }, // Cor do texto selecionado
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem
                        sx={{
                          color: "white",
                          backgroundColor: "#171520",
                          "&:hover": { backgroundColor: "#0D0C13" },
                          "&.Mui-selected": {
                            backgroundColor: "#A00935",
                            "&:hover": { backgroundColor: "#A0052B" },
                          },
                        }}
                        key={cat.id}
                        value={cat.id}
                      >
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category_id && (
                    <FormHelperText error>
                      Por favor, selecione uma categoria.
                    </FormHelperText>
                  )}
                  <Button
                    size="medium"
                    variant="contained"
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="mt-2 bg-green-500 text-[#A0052B] mb-[15px]"
                    style={{ margin: "10px 0px 15px" }}
                  >
                    Nova Categoria
                  </Button>
                </FormControl>
              ) : (
                <div className="gap-2 flex flex-col">
                  <TextField
                    fullWidth
                    label="Nome da Categoria"
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    sx={{
                      "& .MuiInputLabel-root": { color: "#B9042C" }, // Cor do label
                      "& .MuiInputLabel-root.Mui-focused": { color: "#B9042C" }, // Cor do label quando focado
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#B9042C" }, // Cor da borda
                        "&:hover fieldset": { borderColor: "#B9042C" }, // Cor da borda ao hover
                        "&.Mui-focused fieldset": { borderColor: "#B9042C" }, // Cor da borda quando focado
                        "& input": { color: "white" }, // Cor do texto digitado
                      },
                    }}
                  />
                  {errors.category_id && (
                    <FormHelperText error>
                      Por favor, digite um nome.
                    </FormHelperText>
                  )}
                  <div className="flex flex-row justify-around mb-[15px]">
                    <Button
                      size="medium"
                      variant="contained"
                      type="button"
                      onClick={handleAddCategory}
                      className="bg-green-500 text-[#A0052B] w-[45%]"
                    >
                      Adicionar
                    </Button>
                    <Button
                      size="medium"
                      variant="contained"
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="bg-gray-500 text-[#A0052B] w-[45%]"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </FormControl>

            <FormControl fullWidth style={{ margin: "10px 0" }}>
              <TextField
                name="valor"
                label="Valor"
                type="text"
                value={formatarValorMonetario(formData.valor)}
                onChange={(e) => {
                  // Pega apenas os números do valor digitado
                  const numbers = e.target.value.replace(/[^\d]/g, "");

                  // Converte para número decimal
                  const valorNumerico = numbers ? parseFloat(numbers) / 100 : 0;

                  setFormData((prev) => ({
                    ...prev,
                    valor: valorNumerico,
                  }));

                  if (errors.valor) {
                    setErrors((prev) => ({
                      ...prev,
                      valor: false,
                    }));
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                error={errors.valor}
                helperText={errors.valor && "Por favor, insira um valor."}
                sx={{
                  "& .MuiInputLabel-root": { color: "#B9042C" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#B9042C" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#B9042C" },
                    "&:hover fieldset": { borderColor: "#B9042C" },
                    "&.Mui-focused fieldset": { borderColor: "#B9042C" },
                    "& input": { color: "white" },
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth style={{ margin: "10px 0" }}>
              <InputLabel
                sx={{
                  color: "#A00935 !important", // Cor padrão
                  "&.Mui-focused": {
                    color: "#A00935 !important", // Cor quando focado
                  },
                  "&.MuiInputLabel-shrink": {
                    color: "#A00935 !important", // Cor quando encolhido
                  },
                  "&.Mui-disabled": {
                    color: "#A00935 !important", // Cor quando desabilitado
                  },
                }}
                id="tipo-select-label"
                shrink
              >
                Tipo
              </InputLabel>
              <Select
                labelId="tipo-select-label"
                name="tipo"
                label="Tipo"
                value={formData.tipo}
                onChange={handleChange}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#171520",
                      "& .MuiMenuItem-root": {
                        "&:focus": {
                          outline: "none",
                          backgroundColor: "transparent",
                        },
                      },
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
                  "& .MuiSvgIcon-root": { color: "#A00935" }, // Cor do ícone de seta
                  "& .MuiSelect-select": { color: "white" }, // Cor do texto selecionado
                }}
              >
                <MenuItem
                  value="entrada"
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
                  Entrada
                </MenuItem>
                <MenuItem
                  sx={{
                    color: "white",
                    backgroundColor: "#171520",
                    "&:hover": { backgroundColor: "#0D0C13" },
                    "&.Mui-selected": {
                      backgroundColor: "#A00935",
                      "&:hover": { backgroundColor: "#A0052B" },
                    },
                  }}
                  value="saida"
                >
                  Saída
                </MenuItem>
              </Select>
              {errors.tipo && (
                <FormHelperText error>
                  Por favor, selecione um tipo.
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth className="m-5" style={{ margin: "10px 0" }}>
              <TextField
                label="Comentário"
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
                sx={{
                  "& .MuiInputLabel-root": { color: "#B9042C" }, // Cor do label
                  "& .MuiInputLabel-root.Mui-focused": { color: "#B9042C" }, // Cor do label quando focado
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#B9042C" }, // Cor da borda
                    "&:hover fieldset": { borderColor: "#B9042C" }, // Cor da borda ao hover
                    "&.Mui-focused fieldset": { borderColor: "#B9042C" }, // Cor da borda quando focado
                    "& input": { color: "white" }, // Cor do texto digitado
                  },
                }}
              />
              {errors.comentario && (
                <FormHelperText error>
                  Por favor, insira um comentário..
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth style={{ margin: "10px 0" }}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  name="maturity"
                  label="Vencimento"
                  value={formData.maturity ? dayjs(formData.maturity) : null}
                  onChange={handleChangeDate}
                  format="DD/MM/YYYY"
                />
                {errors.maturity && (
                  <FormHelperText error>
                    Por favor, selecione uma data para o vencimento.
                  </FormHelperText>
                )}
              </LocalizationProvider>
            </FormControl>

            <div className="flex justify-end gap-2">
              <Button
                size="medium"
                variant="outlined"
                type="button"
                onClick={onClose}
                color="error"
                className="bg-gray-200"
              >
                Cancelar
              </Button>
              <Button
                size="medium"
                color="primary"
                variant="outlined"
                type="button"
                className="bg-blue-500 text-[#A0052B]"
                onClick={handleSubmit}
              >
                Salvar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default TransactionForm;
