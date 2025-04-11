const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const { Tray, Menu, nativeImage } = require('electron')
const path = require('node:path')

let win;
let tray;

// Creating the window
const createWindow = () => {

    if (win) return;

    win = new BrowserWindow({
        titleBarStyle: 'hidden',
        width: 1200,
        height: 760,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadURL('https://www.aurakingdom-db.com/')
}

app.whenReady().then(() => {
    // Global shortcuts to focus the application
    globalShortcut.register('Control+D', () => {
        createWindow()
        if (!win.isVisible()) {
            win.show()
        }
    })
    globalShortcut.register('Escape', () => {
        if (win && !win.isMinimized() && win.isVisible()) {
            win.hide()
        }
    })

    // tray stuff
    const icon = nativeImage.createFromPath('./icon.png')
    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', role: 'quit' }
    ])

    tray.setToolTip("You're so cute :)")
    tray.setContextMenu(contextMenu)
})