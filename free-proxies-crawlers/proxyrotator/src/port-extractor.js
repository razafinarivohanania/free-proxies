const API = require('free-proxies-api');

/**
 * Fix bug on result from Tesseract
 * 
 * @param {String} port
 * @returns {String} cleaned port 
 */
function cleanPort(port) {
    port = port.trim();

    while (true) {
        let oldPort = port;
        port = port.replace('B', '8')
            .replace('O', '0')
            .replace('S', '5')
            .replace(' ', '');

        if (oldPort == port)
            return port;
    }
}
/**
 * Retrieve port from tr Element
 * 
 * @param {Element} tr Element
 * @returns {String} port
 */
module.exports = async trElement => {
    const dataImage = trElement
        .querySelectorAll('td')[2]
        .querySelector('img')
        .getAttribute('src');

    let port = await API.Image.readBase64ImageAsText(dataImage);
    return cleanPort(port);
}