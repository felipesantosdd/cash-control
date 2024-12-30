// src/main/updater.js
const { autoUpdater } = require("electron-updater");
const { app, dialog } = require("electron");

class UpdateManager {
  constructor() {
    // Configurar logs do autoUpdater
    autoUpdater.logger = require("electron-log");
    autoUpdater.logger.transports.file.level = "info";

    // Configurar eventos do autoUpdaterlectron-lo
    this.setupUpdateEvents();
  }

  setupUpdateEvents() {
    autoUpdater.on("checking-for-update", () => {
      this.sendStatusToWindow("Verificando atualizações...");
    });

    autoUpdater.on("update-available", (info) => {
      dialog
        .showMessageBox({
          type: "info",
          title: "Atualização Disponível",
          message: `Uma nova versão ${info.version} está disponível. Deseja baixar agora?`,
          buttons: ["Sim", "Não"],
        })
        .then((result) => {
          if (result.response === 0) {
            autoUpdater.downloadUpdate();
          }
        });
    });

    autoUpdater.on("update-not-available", () => {
      this.sendStatusToWindow("Aplicação está atualizada.");
    });

    autoUpdater.on("error", (err) => {
      this.sendStatusToWindow(`Erro na atualização: ${err.message}`);
    });

    autoUpdater.on("download-progress", (progressObj) => {
      this.sendStatusToWindow(
        `Velocidade: ${progressObj.bytesPerSecond} - ` +
          `Baixado: ${progressObj.percent}% ` +
          `(${progressObj.transferred}/${progressObj.total})`
      );
    });

    autoUpdater.on("update-downloaded", (info) => {
      dialog
        .showMessageBox({
          type: "info",
          title: "Atualização Pronta",
          message:
            "Uma nova versão foi baixada. A aplicação será reiniciada para instalar a atualização.",
          buttons: ["Reiniciar agora"],
        })
        .then(() => {
          autoUpdater.quitAndInstall();
        });
    });
  }

  sendStatusToWindow(message) {
    // Se você tiver uma janela principal, pode enviar o status para ela
    if (global.mainWindow) {
      global.mainWindow.webContents.send("update-status", message);
    }
    console.log(message);
  }

  checkForUpdates() {
    autoUpdater.checkForUpdates();
  }
}

module.exports = UpdateManager;
