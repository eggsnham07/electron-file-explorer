//Quick way to prune unrequired icons in src/pages/assets/bootstrap-icons
const fs = require("fs")

fs.readdirSync(`${__dirname}/src/pages/assets/bootstrap-icons`).forEach((file) => {
    if(!require("./requiredIcons.json").icons.includes(file)) {
        fs.unlinkSync(`${__dirname}/src/pages/assets/bootstrap-icons/${file}`)
    }
})