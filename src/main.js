const path = require('path');
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js')  // Como está na mesma pasta src
    }
  });

  win.loadFile(path.join(__dirname, './public/index.html')); // Agora apontando para a pasta public
};

app.whenReady().then(createWindow);