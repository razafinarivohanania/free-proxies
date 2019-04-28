const path = require('path');
const File = require('./file');

let countries;

/**
 * Extract country code from countries.json according to country name
 * 
 * @param {String} country
 * @returns {String} code country
 */
module.exports.getCodeCountry = async country => {
    country = country.toLowerCase();

    if (countries)
        return countries[country];

    const contriesPath = path.resolve(__dirname, '..', 'countries.json');
    const data = await File.read(contriesPath);

    countries = JSON.parse(data);
    for (const key of Object.keys(countries))
        countries[key.toLowerCase()] = countries[key];
    
    return countries[country];
}