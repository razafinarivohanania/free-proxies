const sendResponse = require('./send-response');
const proxyChecker = require('../proxy-checker');

function checkCountry(req) {
    let error = proxyChecker.checkCountry(req.query.country);
    if (error && error.includes('is blank'))
        error = null;

    return error;
}

/**
 * Fetch random good proxy from web service
 * 
 * @param {Response} res
 * @param {ProxyDatabase} proxyDatabase 
 */
module.exports = async (req, res, proxyDatabase) => {
    let error = checkCountry(req);
    let proxy;

    if (!error)
        try {
            proxy = await proxyDatabase.getRandomGoodProxy(req.query.country, req.query.provider);
        } catch (exception) {
            error = exception;
        }

    sendResponse(res, error, proxy);
} 