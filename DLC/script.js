const { ipcRenderer } = require("electron")



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
    if(path.endsWith(".exe")) {
        require("child_process").execSync(`start "${path}"`)
    }
    else if(path.endsWith(".64") || path.endsWith(".x86_64") || path.endsWith(".sh")) {
        require("child_process").execSync(`${path}`)
    } else {
        require("child_process").execSync(`${programStarter()}"${path}"`)
    }
}

const drive = getOSDrive()

const files = {
    [drive]: fs.readdirSync(drive),
    [`${os.homedir()}`]: fs.readdirSync(os.homedir())
}

var cPath
var lastPath

function initPage(path) {
    if(!fs.existsSync(`${os.homedir()}/.electron-file-explorer/settings.json`)) {
        fs.writeFileSync(`${os.homedir()}/.electron-file-explorer/settings.json`, JSON.stringify({contextMenuActions:[{"name":"YOUR-ACTION-NAME","command":"COMMAND-FOR-ACTION"}]}))
    }

    console.log(path)
    if(String(path).startsWith("efe:")) {
        if(path == "efe:settings") {
            showSettings()
            document.getElementById("path").value = "Settings Page"
            return;
        }
        else if(path == "efe:terminal") {
            openTerminal()
            initPage(lastPath)
            return;
        }
    } else if(path.startsWith("open:")) {
        document.getElementById("fe").innerHTML = `<iframe style="height:400px;width:100%;" src="${path.split("open:")[1]}"></iframe>`
        return;
    }

    if(new URL(location.href).searchParams.get("s") == "show" || path == "settings") {
        showSettings()
        document.getElementById("path").value = "Settings Page"
        return;
    }

    document.getElementById("fe").innerHTML = ""

    if(path == "" || path == os.homedir() && new URL(location.href).searchParams.get("path")) path = new URL(location.href).searchParams.get("path")
    if(path == lastPath && new URL(location.href).searchParams.get("path")) path = new URL(location.href).searchParams.get("path")

    path = path.replace(/\\\\/gm, "\\").replace(/\/\//gm, "/")
    var reqPath

    if(fs.existsSync(path)) {
        reqPath = fs.readdirSync(path).sort()
    }

    cPath = path

    document.getElementById("path").value = cPath

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

    lastPath = path
}

document.addEventListener("keyup", (e) => {
    if(e.key == "Enter" || e.which === 13 || e.code == "Enter") {
        if(document.activeElement.id == "path") {
            e.preventDefault()
            initPage(document.getElementById("path").value)
        }
    }
})

function showSettings() {
    console.log("Showing settings...")
    document.getElementById("fe").innerHTML = `${fs.readFileSync(__dirname + "/settings.html", 'utf-8')}`
    document.getElementById("fileSettings").showHidden.checked = showHidden
    document.getElementById("fileSettings").picShow.checked = showPic
    document.getElementById("terminal").value = localStorage.getItem("terminal")
    document.getElementById("opt1").href = `?s=hide&path=${os.homedir()}`
    document.getElementById("opt1").innerHTML = `<img class="icon right" src="./assets/bootstrap-icons/house-door-fill.svg">`
    document.getElementById("variables").value = localStorage.getItem("variables")

    document.getElementById("fileSettings").showHidden.addEventListener("click", (e) => {
        localStorage.setItem("showHidden", document.getElementById("fileSettings").showHidden.checked) 
        localStorage.setItem("showPic", document.getElementById("fileSettings").picShow.checked)
    })

    document.getElementById("terminal").addEventListener("input", (e) => {
        localStorage.setItem("terminal", document.getElementById("terminal").value)
    })

    document.getElementById("variables").addEventListener("input", (e) => {
        localStorage.setItem("variables", String(document.getElementById("variables").value).split(","))
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
    if(process.platform == "win32") {
        require("child_process").exec(`start cmd.exe /K "cd ${cPath || lastPath}"`)
        return;
    }
    if(!localStorage.getItem("terminal")) {
        alert("Could not launch terminal! Set the terminal command in settings!")
        return;
    }
    else if(process.platform == "linux" && localStorage.getItem("terminal") != undefined) {
        console.log(`${localStorage.getItem("terminal")} --working-directory=${cPath || lastPath}`)
        require("child_process").exec(`${localStorage.getItem("terminal")} --working-directory=${cPath || lastPath}`)
        return;
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

function openDrive(path) {
    return location.href = `?path=${getOSDrive()}${getOSFileDiv()}${path}`
}

function doAction(action) {
    const childProcess = require("child_process");
    const env = Array(localStorage.getItem("variables"))
    env.forEach(variable => {
        action = action.replace(`{${variable.split(":")[0]}}`, `${variable.split(":")[1]}`)
    })

    action = action.replace("{cwd}", cPath)
    
    try {
        childProcess.execSync(action)
    } catch(err) {
        console.error(err)
    }
}