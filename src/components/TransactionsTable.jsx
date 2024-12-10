import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const CollapsibleTable = ({ transactions, categories }) => {
    // Agrupar transações por categoria e calcular o resumo
    const groupedTransactions = categories?.map((category) => {
        const filteredTransactions = transactions.filter(
            (transaction) => transaction.category_id === category.id
        );
        const totalValue = filteredTransactions.reduce(
            (acc, curr) => acc + Number(curr.valor),
            0
        );
        return {
            categoryName: category.name,
            totalValue,
            transactions: filteredTransactions,
        };
    });

    const Row = ({ row }) => {
        const [open, setOpen] = useState(false);

        return (
            <>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.categoryName}
                    </TableCell>
                    <TableCell align="right">R$ {row.totalValue.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Transações
                                </Typography>
                                <Table size="small" aria-label="transactions">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Data</TableCell>
                                            <TableCell>Valor</TableCell>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell>Comentário</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>
                                                    {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell>
                                                    R$ {Number(transaction.valor).toFixed(2)}
                                                </TableCell>
                                                <TableCell>{transaction.tipo}</TableCell>
                                                <TableCell>{transaction.comentario || 'Sem comentário'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Categoria</TableCell>
                        <TableCell align="right">Valor Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {groupedTransactions?.map((row) => (
                        <Row key={row.categoryName} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CollapsibleTable;
