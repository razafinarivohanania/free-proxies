const proxyChecker = require('../proxy-checker');
const sendResponse = require('./send-response');

/**
 * Check parameter proxy if there is error or not
 * 
 * @param {Request} req
 */
function checkProxy(req) {
    const error = proxyChecker.checkIp(req.query.ip);

    return error ?
        error :
        proxyChecker.checkPort(req.query.port);
}

/**
 * Set proxy as good from web service
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {ProxyDatabase} proxyDatabase
 */
module.exports = async (req, res, proxyDatabase) => {
    let error = checkProxy(req);

    if (!error)
        try {
            await proxyDatabase.setProxyGood(req.query);
        } catch (exception) {
            error = exception;
        }

    sendResponse(res, error);
}