const API = require('free-proxies-api');

function retrieveCountry(countryElement) {
    let url = countryElement.getAttribute('href');
    if (url.startsWith('/'))
        url = 'http://spys.one' + url;

    let country = countryElement.querySelector('font.spy4').textContent;
    return {
        url: url,
        country: country
    }
}

/**
 * Retrieve links with country proxies
 */
module.exports = async (configuration) => {
    const response = await API.Connection.getConnection('http://spys.one/en/proxy-by-country/', configuration.proxy, API.Connection.RESPONSE_TYPE.document);
    const countryElements = response.data.querySelectorAll('tr.spy1x>td.menu1>a');
    console.log(`COUNTRIES FOUND : ${countryElements.length}`);
    const countries = [];
    countryElements.forEach(countryElement => countries.push(retrieveCountry(countryElement)));
    return countries;
}