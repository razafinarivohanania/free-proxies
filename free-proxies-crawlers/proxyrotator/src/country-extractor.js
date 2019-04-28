const API = require('free-proxies-api');

/**
 * Extract country from td Element
 * 
 * @param {Element} td element
 * @returns {String} country
 */
module.exports = async trElement => {
    let country = trElement
        .querySelectorAll('td')[3]
        .querySelector('img')
        .getAttribute('src');

    country = API.String.substringAfter(country, '/', true);
    country = API.String.substringBefore(country, '.');

    const codeCountry = await API.Country.getCodeCountry(country);
    if (!codeCountry) {
        if (country.toLowerCase() === 'korea')
            return "KR";

        throw new Error(`Unable to extract code country from [${country}]`);
    }

    return codeCountry;
}