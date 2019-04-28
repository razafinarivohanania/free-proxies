const proxiesExtractor = require('./src/proxies-extractor');

/**
 * Retrieve proxy from https://free-proxy-list.net/
 * Store result into database
 */
(async () => await proxiesExtractor('https://free-proxy-list.net/', 'free-proxy-list.net'))();