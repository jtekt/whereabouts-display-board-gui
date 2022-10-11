'use strict'

import { app, protocol, BrowserWindow, Menu, Tray, nativeImage} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import axios from 'axios'
import ElectronShutdownHandler from '@paymoapp/electron-shutdown-handler';

import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'


let tray = null
let win = null
let jwt = null


// Custom
if (!isDevelopment){
  app.setLoginItemSettings({ openAtLogin: true })
}




const getToken = async () => {
  // const cookies = await session.defaultSession.cookies.get({ name: 'jwt' })
  // if (!cookies.length) throw 'JWT cookie not found'
  // return cookies[0].value
  return await win.webContents.executeJavaScript('localStorage.getItem("jwt");', true)

}

const updateAvailability = async (availability) => {

  jwt = await getToken()
  const url = `${process.env.VUE_APP_WHEREABOUTS_API_URL}/users/self`
  const options = {
    headers : { authorization: `Bearer ${jwt}` },
    timeout: 3000
  }
  await axios.patch(url, { availability }, options)
}


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
  } 
  else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')

  }

  // Minimize to tray
  win.on('minimize', (event) => {
    event.preventDefault();
    win.hide();
  });

  ElectronShutdownHandler.setWindowHandle(win.getNativeWindowHandle());
  ElectronShutdownHandler.blockShutdown('Please wait for some data to be saved');

  ElectronShutdownHandler.on('shutdown', async () => {
    await updateAvailability('unavailable')
    ElectronShutdownHandler.releaseShutdown();
    win.webContents.send('shutdown');
    app.quit();
  });


}



// Quit when all windows are closed.
app.on('window-all-closed', async () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q

  if (process.platform !== 'darwin') {
    app.quit()
  }

  
})


const minimizeToTray = () => {
  // Minimization to tray

  const icon = nativeImage.createFromDataURL('data:image/png;base64,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')
  tray = new Tray(icon)

  // tray = new Tray('app://./logo.png')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () { win.show() }
    },
  ])
  tray.setToolTip('行先掲示板')
  tray.setContextMenu(contextMenu)
}

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

  // Custom actions
  updateAvailability('available')
  minimizeToTray()


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

