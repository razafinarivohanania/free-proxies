const API = require('free-proxies-api');
const path = require('path');
const connectCountry = require('./src/country')

const getCountries = require('./src/countries');

async function browseCountries(countries, configuration){
    for (let i = 0; i < countries.length; i++) {
        try {
            await connectCountry(countries[i], configuration);
        } catch (exception) {
            console.log(`EXCEPTION : ${exception}`);
        }
    }
}

/**
 * Retrieve all anonymous/elite proxies on http://spys.one/
 * Store results into database
 */
(async () => {
    const pathConfiguration = path.resolve(__dirname, 'configuration.json');
    const configuration = await API.Configuration.getConfiguration(pathConfiguration);
    const countries = await getCountries(configuration);
    await browseCountries(countries, configuration);
})();