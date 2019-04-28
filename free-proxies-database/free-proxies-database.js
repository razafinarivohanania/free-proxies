const express = require('express');
const ProxyDatabase = require('./src/proxy-database');
const addProxy = require('./src/rest/add-proxy');
const setProxyCountry = require('./src/rest/set-proxy-country');
const getRandomGoodProxy = require('./src/rest/get-random-good-proxy');
const removeProxy = require('./src/rest/remove-proxy');
const setProxyGood = require('./src/rest/set-proxy-good');
const getProxies = require('./src/rest/get-proxies');
const API = require('free-proxies-api');
const path = require('path');

let proxyDatabase;
const pathConfiguration = path.resolve(__dirname, 'configuration.json');

/**
 * Intercept closing NodeJs and close database
 */
function closeDatabaseBeforeNodeClosing(){
    process.on('SIGTERM', async () => {
        if (proxyDatabase)
            await proxyDatabase.close();
    
        process.exit(0);
    });
}

/**
 * Main entry point of program
 */
(async () => {
    const configuration = await API.Configuration.getConfiguration(pathConfiguration);
    proxyDatabase = new ProxyDatabase();
    await proxyDatabase.initDatabase(configuration.database.path);
    const app = express();

    app.get('/add-proxy', (req, res) => addProxy(req, res, proxyDatabase));
    app.get('/set-proxy-country', (req, res) => setProxyCountry(req, res, proxyDatabase));
    app.get('/set-proxy-good',  (req, res) => setProxyGood(req, res, proxyDatabase));
    app.get('/get-random-good-proxy', (req, res) => getRandomGoodProxy(req, res, proxyDatabase));
    app.get('/get-proxies', (req, res) => getProxies(req, res, proxyDatabase));
    app.get('/remove-proxy', (req, res) => removeProxy(req, res, proxyDatabase));

    app.listen(configuration.server.port, () => console.log(`Server runs on port ${configuration.server.port}`));

    closeDatabaseBeforeNodeClosing();
})();