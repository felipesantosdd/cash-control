const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Categorias
  createCategory: (name) => ipcRenderer.invoke("create-category", name),
  getCategories: () => ipcRenderer.invoke("get-categories"),

  // Transações
  createTransaction: (data) => ipcRenderer.invoke("create-transaction", data),
  getTransactions: () => ipcRenderer.invoke("get-transactions"),
  getTransactionById: () => ipcRenderer.invoke("get-transaction-by-id", id),
  deleteTransaction: (id) => ipcRenderer.invoke("delete-transaction", id),
  updateTransaction: (id, data) =>
    ipcRenderer.invoke("update-transaction", id, data),
  getTransactionsByYear: (year) =>
    ipcRenderer.invoke("get-transactions-by-year", year),
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
