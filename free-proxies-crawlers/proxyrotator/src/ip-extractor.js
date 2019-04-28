const API = require('free-proxies-api');

const listHidden = [
    'display:none',
    'opacity:0',
    'visibility:hidden',
    'top:-',
    'left:-',
    'width:0',
    'height:0'
];

function isHidden(css) {
    let value = API.String.substringAfter(css, '{');
    value = API.String.substringBefore(value, '}').replace(/ +/g, '')
        .toLowerCase();

    for (let hidden of listHidden) {
        if (value.includes(hidden))
            return true;
    }

    return false;
}

/**
 * Parse CSS to determine if an element is to hide or to show
 * 
 * @param {Element} trElement 
 * @returns {Object} css parsed
 */
function parseCss(trElement) {
    const lines = trElement
        .querySelector('style')
        .textContent
        .trim()
        .split('\n');

    const parsedCss = {};

    lines.forEach(line => {
        let name = API.String.substringBefore(line, '{');
        name = API.String.substringAfter(name, '.');

        parsedCss[name] = isHidden(line);
    });

    return parsedCss;
}

/**
 * Retrieve ip value from tr element
 * 
 * @param {Element} tr element
 * @returns {String} ip
 */
module.exports = trElement => {
    const isHiddenCss = parseCss(trElement);
    const spanElements = trElement
        .querySelectorAll('td')[1]
        .querySelectorAll('*');

    let ip = '';
    for (const spanElement of spanElements) {
        const style = spanElement.getAttribute('style');
        if (style && style.replace(/ +/g, '').toLowerCase().includes('display:none'))
            continue;

        const clazz = spanElement.getAttribute('class');
        if (isHiddenCss[clazz])
            continue;

        ip += spanElement.textContent;
    }

    return ip;
}