const proxyChecker = require('../proxy-checker');
const sendResponse = require('./send-response');

/**
 * Check parameter proxy if there is error or not
 * 
 * @param {Request} req
 */
function checkProxy(req) {
    let error = proxyChecker.checkIp(req.query.ip);
    if (error) return error;

    error = proxyChecker.checkPort(req.query.port);
    if (error) return error;

    error = proxyChecker.checkCountry(req.query.country);
    if (error && error.includes('is blank')) {
        req.query.country = '';
        return;
    }

    return error;
}

/**
 * Set country of proxy from web service
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {ProxyDatabase} proxyDatabase
 */
module.exports = async (req, res, proxyDatabase) => {
    let error = checkProxy(req);

    if (!error)
        try {
            error = await proxyDatabase.setProxyCountry(req.query, req.query.country);
        } catch (exception) {
            error = exception;
        }

    sendResponse(res, error);
}