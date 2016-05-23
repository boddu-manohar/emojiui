#!/usr/bin/env electron

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Module for registering keyboard shortcuts
const globalShortcut = electron.globalShortcut

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

/**
 * Serves the emoji web app
 * @return {void}
 */
function serve () {
  var nodeStatic = require('node-static')
  var file = new nodeStatic.Server('./emoji')

  require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      // Serve the files
      file.serve(request, response)
    }).resume()
  }).listen(8237)
}

/**
 * Creates the Electron window
 * @return {void}
 */
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:8237')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// start the web app
serve()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  // Escape to exit
  globalShortcut.register('Escape', () => {
    app.quit()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
