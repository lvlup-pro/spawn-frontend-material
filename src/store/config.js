var version = "3.0.0-alpha.2"

const configDev = {
    apiUrl: 'http://127.0.0.1/v3/',
    version: version
}

const configStage = {
    apiUrl: 'https://demoapi.lvlup.pro/v3/',
    version: version
}

const configProd = {
    apiUrl: 'https://api.lvlup.pro/v3/',
    version: version
}

if (typeof module !== "undefined" && process.env.NODE_ENV == "development") module.exports = configDev;
if (typeof module !== "undefined" && process.env.NODE_ENV == "staging") module.exports = configStage;
if (typeof module !== "undefined" && process.env.NODE_ENV == "production") module.exports = configProd;