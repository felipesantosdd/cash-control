const path = require("path");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { getDatabase } = require("./backend/config/database");
const categoryService = require("./backend/services/categoryService");
const transactionService = require("./backend/services/transactionService");

try {
  require("electron-reloader")(module, {
    debug: false,
    watchRenderer: false,
  });
} catch (_) {
  console.log("Error");
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./public/index.html"));
};

// IPC Handlers

ipcMain.handle("open-external", async (_, url) => {
  await shell.openExternal(url);
});
ipcMain.handle("create-transaction", async (_, data) => {
  try {
    const result = await transactionService.createTransaction(data);
    return result;
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    throw error;
  }
});

ipcMain.handle("update-transaction", async (event, id, data) => {
  try {
    const result = await transactionService.updateTransaction(id, data);
    return result;
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw error;
  }
});

ipcMain.handle("get-transactions", async () => {
  try {
    const transactions = await transactionService.getAllTransactions();
    return transactions;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw error;
  }
});

ipcMain.handle("get-transaction-by-id", async (_, id) => {
  try {
    const transactions = await transactionService.getTransactionById();
    return transactions;
  } catch (error) {
    console.error("Erro ao buscar transação:", error);
    throw error;
  }
});

ipcMain.handle("delete-transaction", async (_, id) => {
  try {
    await transactionService.deleteTransactionById(id);
    return;
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    throw error;
  }
});

ipcMain.handle("create-category", async (_, name) => {
  try {
    const result = await categoryService.createCategory(name);
    return result;
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  }
});

ipcMain.handle("get-categories", async () => {
  try {
    const categories = await categoryService.getAllCategories();
    return categories;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
});

const initializeApp = async () => {
  try {
    await getDatabase();
    createWindow();

    mainWindow.removeMenu();
  } catch (error) {
    console.error("Erro ao inicializar aplicação:", error);
    app.quit();
  }
};

ipcMain.handle("get-transactions-by-year", async (_, year) => {
  try {
    const transactions = await transactionService.getTransactionsByYear(year);
    return transactions;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw error;
  }
});

app.whenReady().then(initializeApp);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
