import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { TransactionProvider } from '../context/TransactionContext';
import '../styles/globals.css'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <TransactionProvider>
        <App />
    </TransactionProvider>
);