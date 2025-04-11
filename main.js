const { autoUpdater } = require("electron-updater")
const { app, BrowserWindow, globalShortcut } = require('electron')
const { Tray, Menu, nativeImage } = require('electron')
const { spawn } = require('child_process')
const path = require('node:path')

app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
})

let win;
let win2;
let tray;

// Creating the window
const createDatabasePage = () => {

    if (win) return;

    win = new BrowserWindow({
        show: false,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        width: 1200,
        height: 760,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    })

    win.loadURL('https://www.aurakingdom-db.com/')

    win.once('ready-to-show', () => {
        win2.show()
    })
}

const createItemSearch = (searchTerm) => {

    if (win2) {
        win2.loadURL(searchTerm)
        return
    }

    win2 = new BrowserWindow({
        show: false,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        width: 1200,
        height: 760,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    })

    win2.loadURL(searchTerm)

    win2.once('ready-to-show', () => {
        win2.show()
    })
}

app.whenReady().then(() => {
    // Global shortcuts to focus the application
    globalShortcut.register('Control+D', () => {
        createDatabasePage()
        if (!win.isVisible()) {
            win.show()
        } else {
            win.minimize()
            win.hide()
            win.minimize()
        }
        if (win2 && win2.isVisible()) {
            win2.minimize()
            win2.hide()
            win2.minimize()
        }
    })

    globalShortcut.register('Control+F', () => {
        if (win2 && win2.isVisible()) {
            win2.minimize()
            win2.hide()
            win2.minimize()
        } else if (win && win.isVisible()) {
            win.minimize()
            win.hide()
            win.minimize()
        } else {
            const python = spawn('python', ['capture.py'])
            let output = ""
            python.stdout.on('data', (data) => {
                output += data.toString()
            })
            python.on('close', (code) => {
                console.log('OCR result:', output.trim())
                const url = output.trim()
                createItemSearch(url)
                win2.show()
            })
        }
    })

    // tray stuff
    const icon = nativeImage.createFromPath('./icon.ico')
    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', role: 'quit' }
    ])

    tray.setToolTip("AK Helper")
    tray.setContextMenu(contextMenu)
})