const path = require("path");
const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
    },
  });

  // 🔽 KLUCZOWA LINIJKA — ładuj index.html z dist
  win.loadFile(path.join(__dirname, "../dist/index.html"));


  // 🔧 Odkomentuj poniższe, jeśli chcesz widzieć devtools w aplikacji:
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

