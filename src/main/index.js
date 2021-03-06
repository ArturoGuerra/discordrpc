'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import DiscordRPC from 'discord-rpc'
import electrondebug from 'electron-debug'
electrondebug({ showDevTools: true })
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const rpc = new DiscordRPC.Client({ transport: 'ipc' })
const startTimestamp = new Date()
let config = {}
config.rpc = {
  details: 'playing with user data',
  state: 'in congress',
  startTimestamp,
  largeImageKey: 'large',
  largeImageText: 'rrrr',
  smallImageKey: 'small',
  smallImageText: 'REE',
  instance: false
}

function updateConfig (cfg) {
  return {
    details: cfg.details,
    state: cfg.state,
    startTimestamp,
    largeImageKey: cfg.largeImageKey,
    largeImageText: cfg.largeImageText,
    smallImageKey: cfg.smallImageKey,
    smallImageText: cfg.smallImageText,
    instance: false
  }
}

let ClientID = null

function createWindow () {
  /**
   * Initial window options
   */
  let mainWindow = new BrowserWindow({
    height: 450,
    useContentSize: false,
    width: 229,
    resizable: false
  })

  mainWindow.loadURL(winURL)
  // mainWindow.webContents.openDevTools()

  ipcMain.on('asynchronous-message', (event, args) => {
    config.rpc = updateConfig(args.rpc)
    if ((args.client_id.match(/^\d+$/)) && (ClientID !== args.client_ID) && (args.client_id.length >= 16)) {
      ClientID = args.client_id
      setTimeout(() => {
        rpc.login(args.client_id).then(data => {
          event.sender.send('asynchronous-reply', data)
        }).catch(err => {
          event.sender.send('asynchronous-reply', err)
        })
      }, 15)
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

async function setActivity () {
  rpc.setActivity(config.rpc)
}

rpc.on('ready', () => {
  setInterval(() => {
    setActivity()
  }, 15e3)
})
