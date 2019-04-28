const API = require('free-proxies-api');
const queryString = require('querystring');

/**
 * Parameters retrieving ensure :
 * - 500 proxies per page
 * - Anonymous or Elite proxy
 * 
 * @returns {String} parameters
 */
function retrieveParameters(document) {
    const parameters = {
        xpp: 5,
        xf1: 1,
        xf2: 0,
        xf4: 0,
        xf5: 1
    };

    const inputElements = document.querySelectorAll('form+td>input[type=hidden]');
    inputElements.forEach(inputElement => {
        const name = inputElement.getAttribute('name');
        const value = inputElement.getAttribute('value');
        parameters[name] = value;
    });

    //return `xx0=${parameters.xx0}&xpp=5&xf1=0&xf2=0&xf4=0&xf5=0`;

    return queryString.encode(parameters);
}

function evaluateCodeNumber(document) {
    const scriptElements = document.querySelectorAll('script');

    for (const scriptElement of scriptElements) {
        const script = scriptElement.textContent;
        if (script.includes('eval')) {
            eval(script);
            break;
        }
    }
}

function retrievePort(proxyElement) {
    let scriptPort = proxyElement.querySelector('script').textContent;
    scriptPort = API.String.substringAfter(scriptPort, '.write');
    scriptPort = API.String.substringAfter(scriptPort, '+');
    scriptPort = API.String.substringBefore(scriptPort, ')', true);

    eval("var portFromScript = '' + " + scriptPort + ';');
    return portFromScript;
}

function retrieverIp(proxyElement) {
    const ipElement = proxyElement.querySelector('font+font');
    let ip = ipElement.textContent;
    return API.String.substringBefore(ip, 'document');
}

function retrieveProxy(proxyElement, country) {
    return {
        ip: retrieverIp(proxyElement),
        port: retrievePort(proxyElement),
        country: country,
        provider : 'spys.one'
    }
}

async function retrieveAndStoreProxies(document, country, configuration) {
    evaluateCodeNumber(document);
    const proxyElements = document.querySelectorAll('tr[class^=spy1x]');

    for (let i = 2; i < proxyElements.length; i++) {
        const columnElements = proxyElements[i].querySelectorAll('td');
        const anonymity = columnElements[2].textContent;

        console.log(`ANONYMITY : ${anonymity}`);

        if (anonymity === 'NOA') {
            console.log('TRANSPARENT PROXY => SKIPPED');
            continue;
        }

        const proxy = retrieveProxy(columnElements[0], country);

        console.log(`PROXY : ${JSON.stringify(proxy)}`);
        const url = `${configuration.rest.addProxy}?${queryString.encode(proxy)}`;
        await API.Connection.getConnection(url);
    }
}

module.exports = async (country, configuration) => {
    let response = await API.Connection.getConnection(country.url, configuration.proxy, API.Connection.RESPONSE_TYPE.document);
    let parameters = retrieveParameters(response.data);
    response = await API.Connection.postConnection(
        country.url,
        configuration.proxy,
        parameters,
        API.Connection.RESPONSE_TYPE.document
    );
    parameters = retrieveParameters(response.data);
    response = await API.Connection.postConnection(
        country.url,
        configuration.proxy,
        parameters,
        API.Connection.RESPONSE_TYPE.document
    );

    await retrieveAndStoreProxies(response.data, country.country, configuration);
}