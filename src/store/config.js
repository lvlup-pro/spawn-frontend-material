var version = require('../../package.json').version
var apiEndpoint = process.env.API
const config = {
    apiUrl: apiEndpoint,
    version: version
}
module.exports = config;