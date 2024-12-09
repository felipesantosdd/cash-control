const path = require('path');
const { app, BrowserWindow } = require('electron');
const { getDatabase } = require('./backend/config/database');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, './preload.js')
    }
  });

  win.loadFile(path.join(__dirname, './public/index.html'));
  win.webContents.openDevTools();
};

const initializeApp = async () => {
  try {
    // Inicializa o banco de dados
    await getDatabase();
    
    // Inicia o servidor Express
    require('./backend/server');
    
    // Cria a janela do Electron
    createWindow();
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
    app.quit();
  }
};

app.whenReady().then(initializeApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});