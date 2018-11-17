// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const bonjour = require('bonjour')();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 960, height: 720 });

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  mainWindow.loadURL(startUrl);
  // mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // mainWindow.webContents.once('dom-ready', () => {
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const agentCreds = service => {
  const { name, host, port } = service;
  const myRegexp = /^TweakologyAgent_(\w+)/g;
  const match = myRegexp.exec(name);
  if (match) {
    return { name: match[1], host, port };
  }
  return null;
};

ipcMain.on('app-component-mounted', () => {
  // browse for all http services
  const browser = bonjour.find({ type: 'http' });
  browser.on('up', service => {
    const agent = agentCreds(service);
    if (agent) {
      mainWindow.webContents.send('agent-update', { online: true, ...agent });
    }
  });
  browser.on('down', service => {
    const agent = agentCreds(service);
    if (agent) {
      mainWindow.webContents.send('agent-update', { online: false, ...agent });
    }
  });
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
