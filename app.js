const { app, BrowserWindow, ipcMain } = require( "electron" )

function createWindow() {
    const win = new BrowserWindow({
        height: 600,
        width: 1000,
        frame: false,
        backgroundColor: "rgb(1, 73, 141)",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile("src/pages/index.html")
    win.setIcon("build/icon256x256.png")
    if(require("./settings.json").devMode != "true") {
        win.setMenu(null)
    }

    ipcMain.on("event-ping", (event, arg) => {
        console.log(arg)
        if(arg == "close") app.quit()

        else if(arg == "getWinData") {
            event.reply("getWinDataReply", {exists: true, state: win.isMaximized()})
        }
        
        else if(arg == "maximize") {
            win.maximize()
            console.log("Maximizing...")
        }
        else if(arg == "minimize") {
            win.unmaximize()
            console.log("Minimizing...")
        }
        else if(arg == "mini") {
            win.minimize()
        }
    })
}

app.whenReady().then(() => {
    createWindow()

    if(BrowserWindow.getAllWindows().length == -1) createWindow()
})

app.on('window-all-closed', () => {
    if(process.platform !== "darwin") app.quit()
})