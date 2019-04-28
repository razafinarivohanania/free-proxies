const sendResponse = require('./send-response');
const proxyChecker = require('../proxy-checker');

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
 * Remove proxy from database based on ip and port
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {ProxyDatabase} proxyDatabase
 */
module.exports = async (req, res, proxyDatabase) => {
    const error = checkProxy(req);

    if (!error)
        try {
            await proxyDatabase.removeProxy(req.query);
        } catch (exception) {
            error = exception;
        }

    sendResponse(res, error);
}