const API = require('free-proxies-api');
const path = require('path');
const schedule = require('./src/scheduler');

(async () => {
    const pathConfiguration = path.resolve(__dirname, 'configuration.json');
    const configuration = await API.Configuration.getConfiguration(pathConfiguration);

    const schedulers = [];
    for (const job of configuration.jobs)
        schedulers.push(schedule(job.crawler, job.every));

    if (schedulers.length === 1)
        await schedulers[0];
    else
        await Promise.all(schedulers);
})();