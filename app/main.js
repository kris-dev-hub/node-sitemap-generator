const { app, BrowserWindow,ipcMain} = require('electron')
const sitemapGenerator = require('./browser/sitemapGenerator');

var mainWindow = null


function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('./app/index.html');
//  mainWindow.webContents.openDevTools();

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
ipcMain.on("btnclick",async (event,url,page_limit,sleep_time) => {
  sitemapGenerator.generateSitemap(mainWindow,url,page_limit,sleep_time);
});