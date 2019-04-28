const API = require('free-proxies-api');
const path = require('path');

const pathConfiguration = path.resolve(__dirname, 'configuration.json');

function setCountry(proxy, index) {
    console.log(`INDEX : ${index}`);

    try {
        const response = await API.Connection.getConnection(`http://ip-api.com/json/${proxy.ip}?fields=countryCode`);
        if (response.status === 200 && response.countryCode) {
            const url = `${configuration.rest.setProxyCountry}?ip=${proxy.ip}&port=${proxy.port}&country=${proxy.countryCode}`;
            await API.Connection.getConnection(url);
        }
    } catch (exception) {
        console.log(`EXCEPTION : ${exception}`);
    }
}

/**
 * For proxies which have not country, retrieve them from http://ip-api.com/
 * Store result into database
 */
(async () => {
    const configuration = await API.Configuration.getConfiguration(pathConfiguration);
    const response = await API.Connection.getConnection(configuration.rest.getProxies);
    if (response.status != 200 || !response.success) {
        console.log(`ERROR : ${response.data}`);
        return;
    }

    const proxies = response.data.proxies.filter(proxy => !proxy.country);
    console.log(`PROXIES WITHOUT COUNTRY FOUND : ${proxies.length}`);

    let threadCount = 0;
    let setCountries = [];

    if (!configuration.thread)
        configuration.thread = 1;

    for (let i = 0; i < proxies.length; i++) {
        if (threadCount < configuration.thread) {
            setCountries.push(setCountry(proxies[i], i));
            continue;
        }

        if (configuration.thread === 1)
            await setCountries[0];
        else
            await Promise.all(setCountries);
    }
})();