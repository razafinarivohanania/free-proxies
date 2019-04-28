const extractIp = require('./src/ip-extractor');
const extractPort = require('./src/port-extractor');
const extractCountry = require('./src/country-extractor');

const API = require('free-proxies-api');
const path = require('path');

function isAnonymous(proxyElement) {
    const anonymity = proxyElement
        .querySelectorAll('td')[6]
        .textContent
        .toLowerCase();

    console.log(`ANONIMITY : ${anonymity}`);
    return anonymity === 'elite' || anonymity === 'anonymous';
}

async function retrieveProxies(document, configuration) {
    const proxyElements = document.querySelectorAll('table tbody tr');
    const provider = 'proxyrotator';

    for (const proxyElement of proxyElements) {
        if (!isAnonymous(proxyElement)){
            console.log('Skipped');
            continue;
        }

        const ip = extractIp(proxyElement);
        console.log(`IP : ${ip}`);

        const port = await extractPort(proxyElement);
        console.log(`PORT : ${port}`);

        const country = await extractCountry(proxyElement);
        console.log(`COUNTRY : ${country}`);
        
        const response = await API.Connection.getConnection(`${configuration.rest.addProxy}?ip=${ip}&port=${port}&country=${country}&provider=${provider}`);
        console.log(response);
    }
}

function getNextPageUrl(document) {
    const aElements = document.querySelectorAll('div#paging a');

    for (const aElement of aElements) {
        const value = aElement.textContent;

        if (value === '>')
            return aElement.getAttribute('href');
    }
}

async function crawl(){
    const pathConfiguration = path.resolve(__dirname, 'configuration.json');
    const configuration = await API.Configuration.getConfiguration(pathConfiguration);

    let url = 'https://www.proxyrotator.com/free-proxy-list/';
    while (url) {
        const response = await API.Connection.getConnection(url, configuration.proxy, API.Connection.RESPONSE_TYPE.document);
        if (response.status != 200) {
            console.error(`Connection error`);
            return;
        }

        await retrieveProxies(response.data, configuration);
        url = getNextPageUrl(response.data);
    }
}

/**
 * Retrieve proxies from https://www.proxyrotator.com/
 * Store result into database
 */
(async () => {
    try {
        await crawl();
    } catch (exception){
        console.error(exception);
    }

    // Needed to liberate Tesseract
    process.exit(0);
})();