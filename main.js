
///////////////////////////////////////////////////
//////////// Modulos Requeridos por la App ////////
///////////////////////////////////////////////////
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fsMainUtils = require("nodejs-fs-utils") //Requiero modulo extra para manejo de archivos y directorios
hound = require('hound') //Modulo para manejar los eventos de observar directorios
require('dotenv').config({path: __dirname + '/.env'}) //Modulo para manejar variables globales



//Creamos pantalla principal
function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
      
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
