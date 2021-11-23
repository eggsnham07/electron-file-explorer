const fs = require("fs")
const os = require("os")
const { app, ipcRenderer } = require("electron")



console.log(os.homedir())

const code = [
    ".sh",
    ".html",
    ".js",
    ".ts",
    ".bashrc",
    ".cpp",
    ".c",
    ".json",
    ".cs",
    ".java",
    ".jar"
]

const image = [
    ".svg",
    ".png",
    ".jpg",
    ".jpeg"
]

const package = [
    ".pacman",
    ".deb",
    ".AppImage",
    ".rpm"
]

const zip = [
    ".zip",
    ".gz",
    ".xz",
    ".bz"
]

const bin = [
    ".exe",
    ".msi"
]

var showHidden, showPic, dev

if(localStorage.getItem("showHidden") == "true") {
    showHidden = true
    dev = true
} else {
    showHidden = false
    dev = false
}

if(localStorage.getItem("showPic") == "true") {
    showPic = true
} else {
    showPic = false
}


function getOSDrive() {
    switch(process.platform){
        case "linux": return "/"
        case "win32": return os.homedir().split("\\")[0]
        case "darwin": return "/"
        default: return "Not supported!"
    }
}

function getOSFileDiv() {
    switch(process.platform) {
        case "linux": return "/"
        case "win32": return "\\"
        case "darwin": return "/"
        default: return "/"
    }
}

function programStarter() {
    switch(process.platform) {
        case "linux": return "xdg-open "
        case "win32": return ""
        case "darwin": return "open "
        default: return "xdg-open "
    }
}

function launchApp(path) {
    console.log(`Launching: '${programStarter()}"${path}"'`)
    require("child_process").execSync(`${programStarter()}"${path}"`)
}

const drive = getOSDrive()

const files = {
    [drive]: fs.readdirSync(drive),
    [`${os.homedir()}`]: fs.readdirSync(os.homedir())
}

var cPath

function initPage(path) {
    if(new URL(location.href).searchParams.get("s") == "show") {
        showSettings()
        return;
    }

    document.getElementById("fe").innerHTML = ""
    if(new URL(location.href).searchParams.get("path"))  path = new URL(location.href).searchParams.get("path")
    path = path.replace(/\\\\/g, "\\")
    var reqPath

    if(fs.existsSync(path)) {
        reqPath = fs.readdirSync(path)
    }

    cPath = path.replace(/\\\\/, "\\").replace(/\/\//, "/")

    if(reqPath) {
        reqPath.forEach((file) => {
            var stat

            try {
                stat = fs.lstatSync(`${path}${getOSFileDiv()}${file}`)
            } catch(error) {
                fs.appendFileSync("../../Error.log", String(error))
                return
            }

            if(!file.toLowerCase().startsWith("nt") && !file.toLowerCase().startsWith("$")) {

                if(stat.isDirectory()) {
                    if(dev) {
                        var img = document.createElement("img")
                        var div = document.createElement("div")
                        var a = document.createElement("a")
                        var br = document.createElement("br")
        
                        a.innerText = file
                        a.href = `?path=${path}${getOSFileDiv()}${file}${getOSFileDiv()}`
                        div.title = file
                        div.className = "f-holder"
                        img.className = "folder"
                        img.src = "./assets/bootstrap-icons/folder-fill.svg"
                        
                        div.appendChild(img)
                        div.appendChild(br)
                        div.appendChild(a)
                        document.getElementById("fe").appendChild(div)
                    }

                    if(!dev && !file.startsWith(".")) {
                        var img = document.createElement("img")
                        var div = document.createElement("div")
                        var a = document.createElement("a")
                        var br = document.createElement("br")
        
                        a.innerText = file
                        a.href = `?path=${path}${getOSFileDiv()}${file}${getOSFileDiv()}`
                        div.className = "f-holder"
                        div.title = file
                        img.className = "folder"
                        img.src = "./assets/bootstrap-icons/folder-fill.svg"
                        
                        div.appendChild(img)
                        div.appendChild(br)
                        div.appendChild(a)
                        document.getElementById("fe").appendChild(div)
                    }
                }
                else if(stat.isFile()) {
                    console.log(file.split(".")[file.split(".").length-1])

                    var img = document.createElement("img")
                    var div = document.createElement("div")
                    var a = document.createElement("a")
                    var br = document.createElement("br")

                    a.innerText = file
                    a.href = `javascript:launchApp('${path.replace(/\\/g, "\\\\")}${getOSFileDiv()}${getOSFileDiv()}${file}')`
                    div.title = file
                    div.className = "f-holder"

                    img.className = "file"
                    if(file.endsWith(".txt")) img.src = "./assets/bootstrap-icons/file-earmark-text-fill.svg"
                    else if(code.includes(   `.${file.split(".")[file.split(".").length-1]}`)) img.src = "./assets/bootstrap-icons/file-earmark-code-fill.svg"
                    else if(image.includes(  `.${file.split(".")[file.split(".").length-1]}`)) {
                        if(localStorage.getItem("showPic") == "true") img.src = `${path}${getOSFileDiv()}${file}`
                        else img.src = "./assets/bootstrap-icons/file-earmark-image-fill.svg"
                    }
                    else if(zip.includes(    `.${file.split(".")[file.split(".").length-1]}`)) img.src = "./assets/bootstrap-icons/file-earmark-zip-fill.svg"
                    else if(package.includes(`.${file.split(".")[file.split(".").length-1]}`)) img.src = "./assets/bootstrap-icons/box-seam.svg"
                    else if(bin.includes(    `.${file.split(".")[file.split(".").length-1]}`)) img.src = "./assets/bootstrap-icons/file-earmark-binary-fill.svg"

                    else if(file.endsWith(`.desktop`)) {
                        const iconLoc = `${os.homedir()}${getOSFileDiv()}.local${getOSFileDiv()}share${getOSFileDiv()}icons${getOSFileDiv()}hicolor`
                        var sIcon = `${fs.readFileSync(`${path}${getOSFileDiv()}${file}`, 'utf-8').split("Icon=")[1].split("\n")[0]}`
                        console.log(sIcon)

                        /*
                        * Steam icons
                        */

                        if(sIcon.startsWith("steam")) {
                            sIcon += ".png"
                            if(fs.existsSync(`${iconLoc}${getOSFileDiv()}16x16${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`)) {
                                img.src = `${iconLoc}${getOSFileDiv()}16x16${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`
                            }

                            else if(fs.existsSync(`${iconLoc}${getOSFileDiv()}24x24${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`)) {
                                img.src = `${iconLoc}${getOSFileDiv()}24x24${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`
                            }

                            else if(fs.existsSync(`${iconLoc}${getOSFileDiv()}32x32${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`)) {
                                img.src = `${iconLoc}${getOSFileDiv()}32x32${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`
                            }

                            else if(fs.existsSync(`${iconLoc}${getOSFileDiv()}48x48${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`)) {
                                img.src = `${iconLoc}${getOSFileDiv()}48x48${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`
                            }

                            else if(fs.existsSync(`${iconLoc}${getOSFileDiv()}64x64${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`)) {
                                img.src = `${iconLoc}${getOSFileDiv()}64x64${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`
                            }

                            else if(fs.existsSync(`${iconLoc}${getOSFileDiv()}96x96${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`)) {
                                img.src = `${iconLoc}${getOSFileDiv()}96x96${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`
                            }

                            else if(fs.existsSync(`${iconLoc}${getOSFileDiv()}128x128${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`)) {
                                img.src = `${iconLoc}${getOSFileDiv()}128x128${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`
                            }

                            else if(fs.existsSync(`${iconLoc}${getOSFileDiv()}256x256${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`)) {
                                img.src = `${iconLoc}${getOSFileDiv()}256x256${getOSFileDiv()}apps${getOSFileDiv()}${sIcon}`
                            }

                            else {
                                img.src = `./assets/bootstrap-icons/file-earmark-image-fill.svg`
                            }
                        } else {
                            console.log("Not steam game...")
                            if(image.includes(sIcon.split(".")[sIcon.split(".").length-1])) img.src = sIcon
                        }
                    }
                    else img.src = "./assets/bootstrap-icons/file-earmark-fill.svg"

                    if(dev) {
                        div.appendChild(img)
                        div.appendChild(br)
                        div.appendChild(a)
                        document.getElementById("fe").appendChild(div)
                    }

                    if(!dev && !file.startsWith(".")) {
                        div.appendChild(img)
                        div.appendChild(br)
                        div.appendChild(a)
                        document.getElementById("fe").appendChild(div)
                    }
                }
            }
        })
    }
}

function showSettings() {
    console.log("Showing settings...")
    document.getElementById("fe").innerHTML = `${fs.readFileSync(__dirname + "/settings.html", 'utf-8')}`
    document.getElementById("fileSettings").showHidden.checked = showHidden
    document.getElementById("fileSettings").picShow.checked = showPic
    document.getElementById("terminal").value = localStorage.getItem("terminal")
    document.getElementById("opt1").href = `?s=hide&path=${os.homedir()}`
    document.getElementById("opt1").innerHTML = `<img class="icon right" src="./assets/bootstrap-icons/house-door-fill.svg">`

    document.getElementById("fileSettings").showHidden.addEventListener("click", (e) => {
        localStorage.setItem("showHidden", document.getElementById("fileSettings").showHidden.checked) 
        localStorage.setItem("showPic", document.getElementById("fileSettings").picShow.checked)
    })

    document.getElementById("terminal").addEventListener("input", (e) => {
        localStorage.setItem("terminal", document.getElementById("terminal").value)
    })

    document.getElementById("fileSettings").picShow.addEventListener("change", (e) => {
        //fs.writeFileSync(__dirname + "/fs.json", JSON.stringify({
        //    "showHidden": document.getElementById("fileSettings").showHidden.checked,
        //    "showPic": document.getElementById("fileSettings").picShow.checked
        //}))

        localStorage.setItem("showHidden", document.getElementById("fileSettings").showHidden.checked) 
        localStorage.setItem("showPic", document.getElementById("fileSettings").picShow.checked)
    })
}

function openTerminal() {
    if(process.platform == "linux") {
        console.log(`${localStorage.getItem("terminal")} --working-directory=${cPath}`)
        require("child_process").exec(`${localStorage.getItem("terminal")} --working-directory=${cPath}`)
    }
    else if(process.platform == "win32") {
        require("child_process").exec(`${localStorage.getItem("terminal")} cmd.exe /K "cd ${cPath}"`)
    }
}

function quit() {
    console.log("Quitting...")
    ipcRenderer.send("event-ping", "close")
}

function toggleMaximized() {
    var returnJson
    ipcRenderer.send("event-ping", "getWinData")
    ipcRenderer.on("getWinDataReply", (event, arg) => {
        returnJson = arg
        const interval = setInterval(function() {
            console.log(returnJson)
            if(returnJson.exists == true) {
                console.log(returnJson)
                if(returnJson.state == true) {
                    ipcRenderer.send("event-ping", "minimize")
                    console.log("Minimizing...")
                    document.getElementById("tm").src = "./assets/bootstrap-icons/fullscreen.svg"
                } else {
                    ipcRenderer.send("event-ping", "maximize")
                    console.log("Maximizing...")
                    document.getElementById("tm").src = "./assets/bootstrap-icons/fullscreen-exit.svg"
                }

                clearInterval(interval)
            }
        }, 500)
    })
}

function openHome(path) {
    return location.href = `?path=${os.homedir()}${getOSFileDiv()}${path}`
}