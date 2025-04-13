const { autoUpdater } = require("electron-updater")
const { app, BrowserWindow, globalShortcut } = require('electron')
const { Tray, Menu, nativeImage } = require('electron')
const { PythonShell } = require('python-shell')
const { spawn } = require('child_process');
const path = require('path')

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

    showWindowOnReady(win)
}

const createItemSearch = (searchTerm) => {

    console.log("attemping to load " + searchTerm + "\n")

    if (win2) {
        console.log('Reloading URL in existing win2');
        win2.loadURL(searchTerm)
        showWindowOnReady(win2)
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

    console.log('Loading URL in new win2');
    win2.loadURL(searchTerm)
    showWindowOnReady(win2)
}

const showWindowOnReady = (window) => {
    window.webContents.once('did-finish-load', () => {
        console.log('win2 finished loading');
        window.show();
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
            const capturePath = app.isPackaged 
                ? path.join(process.resourcesPath, 'python')
                : path.join(__dirname, 'python')
            const capturePy = path.join(capturePath, 'capture.py')

            const whitelistPath = app.isPackaged
                ? path.join(process.resourcesPath, 'python')
                : path.join(__dirname, 'python')
            const whitelistPkl = path.join(whitelistPath, 'whitelist.pkl')

            const python = spawn('python', [capturePy, whitelistPkl], {
                stdio: ['ignore', 'pipe', 'pipe'],
                windowsHide: true
            })

            let output = ""

            python.stdout.on('data', (data) => {
                console.log("Python stdout:", data.toString());
                output += data.toString()
            })

            python.stderr.on('data', (data) => {
                console.error("Python stderr:", data.toString());
            });

            python.on('close', (code) => {
                console.log('OCR result:', output.trim())
                const url = output.trim()
                createItemSearch(url)
            })
        }
    })

    // tray stuff
    const icon = nativeImage.createFromPath('./icon.ico')
    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', role: 'quit' }
    ])

    tray.setToolTip("AuraKingdomHelper")
    tray.setContextMenu(contextMenu)
})