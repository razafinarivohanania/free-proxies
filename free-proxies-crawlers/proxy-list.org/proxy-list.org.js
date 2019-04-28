const API = require('free-proxies-api');
const path = require('path');
const queryString = require('querystring');

function retrieveCountry(proxyElement) {
    const rawCountry = proxyElement
        .querySelector('li.country-city span.name')
        .textContent;

    return API.String.substringBefore(rawCountry, ' ');
}

function retrieveProxy(proxyElement) {
    let scriptProxy = proxyElement.querySelector('li.proxy>script').textContent;
    scriptProxy = API.String.substringAfter(scriptProxy, "Proxy('");
    scriptProxy = API.String.substringBefore(scriptProxy, ')', true);

    const rawProxy = API.String.decodeBase64(scriptProxy).split(':');
    return {
        ip: rawProxy[0],
        port: rawProxy[1],
        country: retrieveCountry(proxyElement),
        provider: 'proxy-list.org'
    }
}

async function retrieveProxies(document, configuration) {
    const proxyElements = document.querySelectorAll('div#proxy-table ul');
    console.log(`PROXIES FOUND : ${proxyElements.length}`);

    for (let i = 1; i < proxyElements.length; i++) {
        const proxy = retrieveProxy(proxyElements[i]);
        console.log(`PROXY : ${JSON.stringify(proxy)}`);

        const url = `${configuration.rest.addProxy}?${queryString.encode(proxy)}`;
        await API.Connection.getConnection(url);
    }
}

function getNextPageUrl(document) {
    const urlElement = document.querySelector('div#proxy-table+div a.next');
    let url;

    if (urlElement) {
        url = urlElement.getAttribute('href');

        if (url.startsWith('.'))
            url = 'http://proxy-list.org/english/' + API.String.substringAfter(url, '.');
    }

    return url;
}

/**
 * Retrieve all anonymous/elite proxies on http://proxies-list.org/
 * Store results into database
 */
(async () => {
    const pathConfiguration = path.resolve(__dirname, 'configuration.json');
    const configuration = await API.Configuration.getConfiguration(pathConfiguration);
    let url = 'http://proxy-list.org/english/search.php?search=anonymous-and-elite&country=any&type=anonymous-and-elite&port=any&ssl=any&setlang=english';

    while (url) {
        let response = await API.Connection.getConnection(url, configuration.proxy, API.Connection.RESPONSE_TYPE.document);
        if (response.status != 200)
            return;

        await retrieveProxies(response.data, configuration);
        url = getNextPageUrl(response.data);
    }
})();