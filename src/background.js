'use strict'

import { app, protocol, BrowserWindow, session, Menu, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import axios from 'axios'

import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

let tray = null
let win = null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: '行先掲示板',
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }


  win.on('minimize', function (event) {
    event.preventDefault();
    win.hide();
  });





}


const updateAvailability = async (availability) => {
  const cookies = await session.defaultSession.cookies.get({ name: 'jwt' })
  if (!cookies.length) throw 'JWT cookie not found'
  const jwt = cookies[0].value
  const url = `${process.env.VUE_APP_WHEREABOUTS_API_URL}/users/self`
  const headers = { authorization: `Bearer ${jwt}` }
  await axios.patch(url, { availability }, { headers })
}

// Quit when all windows are closed.
app.on('window-all-closed', async () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q


  try {
    await updateAvailability('unavailable')
  } catch (error) {
    console.error(error)
  }
  finally {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  


  
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

  updateAvailability('available')

  tray = new Tray('./public/logo.png')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function() {
        win.show()
      }
    },
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)


})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
