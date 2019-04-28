const extractProxies = require('free-proxy-list.net');

/**
 * Retrieve proxy from https://www.sslproxies.org/
 * Store result into database
 */
(async () => await extractProxies('https://www.sslproxies.org/', 'www.sslproxies.org'))();