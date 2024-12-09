const path = require('path');
const { app, BrowserWindow } = require('electron');

try {
  require('electron-reloader')(module, {
    watchRenderer: true,
  });
} catch (_) { console.log('Error'); }

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),  // Como está na mesma pasta src
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, './public/index.html')); // Agora apontando para a pasta public
  win.webContents.openDevTools();
};

app.whenReady().then(createWindow);