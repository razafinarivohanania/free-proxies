const proxyChecker = require('../proxy-checker');
const sendResponse = require('./send-response');

function checkProxy(req) {
    let error = proxyChecker.checkIp(req.query.ip);
    if (error) return error;

    error = proxyChecker.checkPort(req.query.port);
    if (error) return error;

    error = proxyChecker.checkState(req.query.state);
    if (error)
        if (error.includes('is blank'))
            req.query.state = '0';
        else
            return error;

    error = proxyChecker.checkCountry(req.query.country);
    if (error)
        if (error.includes('is blank'))
            req.query.country = '';
        else
            return error;

    error = proxyChecker.checkProvider(req.query.provider);
    return error;
}

/**
 * Store proxy into database
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {ProxyDatabase} proxyDatabase
 */
module.exports = async (req, res, proxyDatabase) => {
    let error = checkProxy(req);
    if (!error)
        try {
            await proxyDatabase.addProxy(req.query);
        } catch (exception) {
            error = exception;
        }

    sendResponse(res, error);
};