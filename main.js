const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
//var $ = require("jquery");

global.settings = {
    databaseFolder : app.getPath("documents")
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWnd;

function createWindow() {
    // Create the browser window.
    mainWnd = new BrowserWindow({ width: 1200, height: 700 });

    // and load the index.html of the app.
    mainWnd.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    //mainWnd.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWnd.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWnd = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWnd === null) {
        createWindow();
    }
});