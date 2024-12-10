import React, { useEffect, useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
import { capitalizeText } from '../utils/stringUtils';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Button,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    FormControl,
    InputLabel,
    FormHelperText
} from '@mui/material';
import dayjs from 'dayjs';

const TransactionForm = ({ onClose, onSubmit }) => {
    const { TRANSACTION_TYPES, categories, fetchCategories, createCategory } = useTransaction();

    const [formData, setFormData] = useState({
        valor: 0,
        tipo: 'saida',
        category_id: '',
        comentario: '',
        maturity: null,
        pay:false
    });

    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [errors, setErrors] = useState({
        valor: false,
        tipo: false,
        category_id: false,
        comentario: false,
        maturity: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'valor' ? parseFloat(value) || 0 : name === 'comentario' ? capitalizeText(value) : value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: false
        }));
    };


    const handleChangeDate = (newValue) => {
        setFormData((prev) => ({
            ...prev,
            maturity: new Date(newValue).toISOString(),
        }));
        setErrors((prev) => ({
            ...prev,
            maturity: false
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
            onSubmit(formData);
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
                setNewCategory('');
                setIsAddingCategory(false);
            } else {
                throw new Error('Resposta inválida do servidor');
            }
        } catch (error) {
            console.error('Erro detalhado ao criar categoria:', {
                message: error.message,
                stack: error.stack
            });
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-2/4">
                <h2 className="text-xl mb-4">Nova Transação</h2>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth className="mb-4">
                        {!isAddingCategory ? (
                            <FormControl fullWidth>
                                <InputLabel id="category-select-label" >Categoria</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    name="category_id"
                                    label="Categoria"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    defaultValue=''
                     
                                >                                 
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.category_id && (
                                    <FormHelperText error>Por favor, selecione uma categoria.</FormHelperText>
                                )}
                                <Button
                                    size="medium"
                                    variant="contained"
                                    type="button"
                                    onClick={() => setIsAddingCategory(true)}
                                    className="mt-2 bg-green-500 text-white mb-[15px]"
                                    style={{ margin: '10px 0px 15px' }}
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
                                />
                                 {errors.category_id && (
                                    <FormHelperText error>Por favor, digite um nome.</FormHelperText>
                                )}
                                    <div className='flex flex-row justify-around mb-[15px]'>
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            type="button"
                                            onClick={handleAddCategory}
                                            className="bg-green-500 text-white w-[45%]"
                                        >
                                            Adicionar
                                        </Button>
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            type="button"
                                            onClick={() => setIsAddingCategory(false)}
                                            className="bg-gray-500 text-white w-[45%]"
                                        >
                                            Cancelar
                                        </Button>
                                </div>
                            </div>
                        )}
                    </FormControl>

                    <FormControl fullWidth style={{margin:'10px 0'}}>
                        <TextField
                            name="valor"
                            label="Valor"
                            value={formData.valor.toString()}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>
                            }}
                            error={errors.valor}
                            helperText={errors.valor && 'Por favor, insira um valor.'}
                        />
                    </FormControl>

                    <FormControl fullWidth style={{margin:'10px 0'}}>
                        <InputLabel id="tipo-select-label" shrink>Tipo</InputLabel>
                        <Select
                            labelId="tipo-select-label"
                            name="tipo"
                            label="Tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                        >
                            <MenuItem value="entrada">Entrada</MenuItem>
                            <MenuItem value="saida">Saída</MenuItem>
                        </Select>
                        {errors.tipo && <FormHelperText error>Por favor, selecione um tipo.</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth className="m-5" style={{margin:'10px 0'}}>
                        <TextField
                            label="Comentário"
                            name="comentario"
                            value={formData.comentario}
                            onChange={handleChange}
                        />
                          {errors.comentario && <FormHelperText error>Por favor, insira um comentário..</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth style={{ margin: '10px 0' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DatePicker
                        name="maturity"
                        label="Vencimento"
                        value={formData.maturity ? dayjs(formData.maturity) : null}
                        onChange={handleChangeDate}
                        format="DD/MM/YYYY"
                        />
                        {errors.maturity && (
                        <FormHelperText error>Por favor, selecione uma data para o vencimento.</FormHelperText>
                        )}
                    </LocalizationProvider>
                    </FormControl>

                    <div className="flex justify-end gap-2">
                        <Button
                            size="medium"
                            variant="outlined"
                            type="button"
                            onClick={onClose}
                            color='error'
                            className="bg-gray-200"
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="medium"
                            color="primary"
                            variant="outlined"
                            type="submit"
                            className="bg-blue-500 text-white"
                        >
                            Salvar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;