var version = require('../../package.json').version
var apiEndpoint = process.env.API
const config = {
    apiUrl: apiEndpoint,
    version: version,
    reCaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
}
module.exports = config;