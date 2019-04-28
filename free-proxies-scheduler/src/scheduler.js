const { spawn } = require('child_process');
const path = require('path');

function run(name) {
    return new Promise(resolve => {
        console.log(`RUN ${name}`);
        const pathCrawler = path.resolve(__dirname, '..', '..', 'free-proxies-crawlers', name, name);
        const crawler = spawn('node', [pathCrawler]);

        crawler.on('close', code => {
            console.log(`DONE FOR ${name} WITH CODE ${code}, WAITING FOR NEXT`);
            resolve();
        });
    });
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Run crawler by time interval based on "every"
 * 
 * @param {String} name
 * @param {int} every
 */
module.exports = async (name, every) => {
    while (true) {
        await run(name);
        await sleep(every);
    }
}