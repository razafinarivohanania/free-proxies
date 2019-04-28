const API = require('free-proxies-api');
const path = require('path');

function isAnonymous(tdElements) {
    const anonymity = tdElements[4]
        .textContent
        .trim()
        .toLowerCase();

    console.log(`Anonymity : ${anonymity}`);
    return anonymity === 'anonymous' || anonymity.includes('elite');
}

function retrieveProxy(proxyElement) {
    const tdElements = proxyElement.querySelectorAll('td');

    if (!isAnonymous(tdElements))
        return;

    const ip = tdElements[0].textContent;
    console.log(`IP : ${ip}`);

    const port = tdElements[1].textContent;
    console.log(`PORT : ${port}`);

    const country = tdElements[2].textContent;
    console.log(`COUNTRY : ${country}`);

    return {
        ip: ip,
        port: port,
        country: country
    };
}

/**
 * Retrieve proxies based on link and provider
 * Store result into database
 * 
 * @param {String} link
 * @param {String} provider
 */
module.exports = async (link, provider) => {
    const pathConfiguration = path.resolve(__dirname, '..', 'configuration.json');
    const configuration = await API.Configuration.getConfiguration(pathConfiguration);
    const response = await API.Connection.getConnection(link, configuration.proxy, API.Connection.RESPONSE_TYPE.document);

    if (response.status != 200) {
        console.error('Connection error => Skipped');
        return;
    }

    const proxyElements = response.data.querySelectorAll('table#proxylisttable tbody>tr');
    for (const proxyElement of proxyElements) {
        const proxy = retrieveProxy(proxyElement);

        if (proxy) {
            const url = `${configuration.rest.addProxy}?ip=${proxy.ip}&port=${proxy.port}&country=${proxy.country}&provider=${provider}`;
            const response = await API.Connection.getConnection(url);
            console.log(response.data);
        }
    }
}