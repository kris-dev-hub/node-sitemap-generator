const { app, BrowserWindow,ipcMain} = require('electron')
const sitemapGenerator = require('./browser/sitemapGenerator');

var mainWindow = null


function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('./app/index.html');
  mainWindow.webContents.openDevTools();

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

//start scanning button
ipcMain.on("btnclick",async (event,url,pageLimit,sleepTime) => {
  try {
    await sitemapGenerator.generateSitemap(mainWindow,url, pageLimit, sleepTime);
  } catch (error) {
    event.sender.send('error', error.message);
  }
//  sitemapGenerator.generateSitemap(mainWindow,url,pageLimit,sleepTime);
});
