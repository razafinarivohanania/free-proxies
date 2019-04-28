const API = require('free-proxies-api');
const path = require('path');

function retrieveCountry(columnElements) {
    const rawCountry = columnElements[2]
        .querySelectorAll('span.flag-icon')
        .getAttribute('class');

    return API.String
        .substringAfter(rawCountry, 'flag-icon-')
        .trim();
}

function retrieveProxy(proxyElement) {
    const columnElements = proxyElement.querySelectorAll('td');
    const ip = columnElements[0].textContent;
    const port = columnElements[1].textContent;

    return {
        ip: ip,
        port: port,
        country: retrieveCountry(customElements)
    }
}

async function retrieveProxies(document, configuration) {
    const proxyElements = document.querySelectorAll('table.proxy__t>tbody>tr');
    console.log(`PROXIES FOUND : ${proxyElements.length}`);

    for (const proxyElement of proxyElements) {
        const proxy = retrieveProxy(proxyElement);
        console.log(`PROXY : ${JSON.stringify(proxy)}`);

        const url = `${configuration.rest.addProxy}?${queryString.encode(proxy)}`;
        await API.Connection.getConnection(url);
    }
}

function getNextPageUrl(document) {
    const urlElement = document.querySelector('div.proxy__pagination li.arrow__right>a');
    let url;

    if (urlElement) {
        url = urlElement.getAttribute('href');
        if (url.startsWith('/'))
            url = 'https://hidemyna.me' + url;
    }

    return url;
}

/**
 * Retrieve all anonymous/elite proxies on http://hidemyna.me/
 * Store results into database
 */
(async () => {
    const configurationPath = path.resolve(__dirname, 'configuration.json');
    const configuration = await API.Configuration.getConfiguration(configurationPath);
    let url = 'https://hidemyna.me/en/proxy-list/?type=hs&anon=234';

    while (url) {
        const response = await API.Connection.getConnection(url, configuration.proxy, API.Connection.RESPONSE_TYPE.document);
        //TODO unblock cloudlfare protection
        if (response.status != 200)
            return;

        await retrieveProxies(response.data, configuration);
        url = getNextPageUrl(response.data);
    }
})();