const axios = require('axios-proxy-fix');
const apiUrl = require('url');
const jsdom = require('jsdom');
const Variable = require('./variable');
const { JSDOM } = jsdom;

const RESPONSE_TYPE = {
    document: 0,
    json: 1
};

function buildHeaders(url, isPost) {
    const headers = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Upgrade-Insecure-Requests': 1,
        'Host': apiUrl.parse(url).hostname,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
    }

    if (isPost)
        headers['Content-Type'] = 'application/x-www-form-urlencoded';

    return headers;
}

function buildRequest(url, method, proxy, timeout, postParameters) {
    const request = {
        url: url,
        method: method,
        headers: buildHeaders(url, method === 'post'),
        validateStatus: status => true
    }

    if (postParameters) {
        request.data = postParameters;
        console.log(`POST PARAMETERS : ${postParameters}`);
    }

    if (timeout)
        request.timeout = timeout;

    if (proxy && proxy.host) {
        const nativeProxy = {
            host: proxy.host,
            port: proxy.port
        };

        if (proxy.username)
            nativeProxy.auth = {
                username: proxy.username,
                password: proxy.password
            };

        request.proxy = nativeProxy;
    }

    return request;
}

function cleanData(response, responseType, runScript) {
    if (responseType === RESPONSE_TYPE.document) {
        let dom;

        if (runScript)
            dom = new JSDOM(response.data, { runScripts: "dangerously" });
        else
            dom = new JSDOM(response.data);

        return dom.window.document;
    }

    if (responseType === RESPONSE_TYPE.json)
        return Variable.isArray(response.data) || Variable.isObject(response.data) ?
            response.data :
            JSON.parse(response.data);

    return response.data;
}

async function connect(url, method, proxy, postParameters, responseType, timeout, runScript) {
    console.log(`CONNECTING : ${url}`);
    const response = await axios.request(buildRequest(url, method, proxy, timeout, postParameters));
    console.log(`STATUS : ${response.status}`);

    return {
        status: response.status,
        data: cleanData(response, responseType, runScript)
    }
}

/**
 * Determine respons type from connection
 * Documet or JSON
 */
module.exports.RESPONSE_TYPE = RESPONSE_TYPE;

/**
 * Connect from GET method
 * 
 * @param {String} url
 * @param {Object} proxy
 * @param {int} responseType
 * @param {int} timeout
 * @returns {Promise<Object>} response
 */
module.exports.getConnection = async (url, proxy, responseType, timeout) => {
    const response = await connect(url, 'get', proxy, null, responseType, timeout);
    return response;
};

/**
 * Connect from POST method
 * 
 * @param {String} url
 * @param {Object} proxy
 * @param {String} postParameters
 * @param {int} responseType
 * @returns {Promise<Object>} response
 */
module.exports.postConnection = async (url, proxy, postParameters, responseType, timeout, runScript) => {
    const response = await connect(url, 'post', proxy, postParameters, responseType, timeout, runScript);
    return response;
}

