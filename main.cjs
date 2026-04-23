const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const indexPath = app.isPackaged
    ? path.join(process.resourcesPath, "app.asar", "dist", "index.html")
    : path.join(__dirname, "dist", "index.html");

  win.loadFile(indexPath);

}

app.whenReady().then(createWindow);
