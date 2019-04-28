const sendResponse = require('./send-response');
const proxyChecker = require('../proxy-checker');

function checkParameters(req) {
    let error = proxyChecker.checkCountry(req.query.country);
    if (error && !error.includes('is blank'))
        return error;

    error = proxyChecker.checkProvider(req.query.provider);
    if (error && !error.includes('is blank'))
        return error;
}

/**
 * Retrieve proxies from web-service
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {ProxyDatabase} proxyDatabase
 * @returns {Array} proxies
 */
module.exports = async (req, res, proxyDatabase) => {
    let error = checkParameters(req);
    let proxies;

    if (!error)
        try {
            proxies = await proxyDatabase.getProxies(req.query.country, req.query.state, req.query.provider);
        } catch (exception) {
            error = exception;
        }

    sendResponse(res, error, { proxies: proxies });
}