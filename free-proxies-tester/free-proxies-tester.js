
const API = require('free-proxies-api');
const path = require('path');

const pathConfiguration = path.resolve(__dirname, 'configuration.json');

function getRandomTestUrl(configuration) {
    return configuration.urls[Math.floor(Math.random() * configuration.urls.length)];
}

async function removeProxy(proxy, configuration) {
    console.log(`REMOVING BAD PROXY : ${proxy.id}`);
    const response = await API.Connection.getConnection(`${configuration.rest.removeProxy}?ip=${proxy.ip}&port=${proxy.port}`);
    console.log(response.data);
}

async function testProxy(proxy, configuration, index) {
    console.log(`INDEX : ${index}`);
    console.log(`PROXY : ${proxy.id}`);

    let response;
    try {
        response = await API.Connection.getConnection(getRandomTestUrl(configuration), {
            host: proxy.ip,
            port: proxy.port
        }, null, 5000);

        console.log(`STATUS : ${response.status}`);
        if (response.status >= 200 && response.status <= 399) {
            console.log(`SET PROXY GOOD : ${proxy.id}`);
            console.log(response.data);
            response = await API.Connection.getConnection(`${configuration.rest.setProxyGood}?ip=${proxy.ip}&port=${proxy.port}`);
            console.log(response.data);
        } else
            await removeProxy(proxy, configuration);
    } catch (exception) {
        await removeProxy(proxy, configuration);
    }
}

async function testProxies(configuration) {
    let response = await API.Connection.getConnection(configuration.rest.getProxies);
    console.log(`STATUS : ${response.status}`);

    if (response.status != 200 || !response.data.success) {
        console.log(`ERROR : ${response.data}`);
        return;
    }

    const proxies = response.data.proxies;
    console.log(`PROXIES FOUND : ${proxies.length}`);

    //Order by unknown state to priorize them
    proxies.sort((proxy1, proxy2) => proxy1.state - proxy2.state);

    let asyncTestProxies = [];
    let threadCount = 0;

    if (!configuration.thread)
        configuration.thread = 1;

    for (let i = 0; i < proxies.length; i++) {
        if (threadCount < configuration.thread) {
            asyncTestProxies.push(testProxy(proxies[i], configuration, i));
            continue;
        }

        if (asyncTestProxies.length === 1)
            await asyncTestProxies[0];
        else
            await Promise.all(asyncTestProxies);
            
        asyncTestProxies = [];
        threadCount = 0;
        threadCount++;
    }

    if (asyncTestProxies.length)
        await Promise.all(asyncTestProxies);
}

/**
 * Retrieve all proxies from database
 * Check each proxy if good or not
 * Multi-threading is available by specifying thread on configuration
 */
(async () => {
    const configuration = await API.Configuration.getConfiguration(pathConfiguration);
    await testProxies(configuration, configuration);
})();
