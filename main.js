require('update-electron-app')()
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

// Creating the window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    createWindow()
})

// Quit the app when all windows are closed on Windows & Linux
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
