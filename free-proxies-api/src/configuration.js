const File = require('./file');
const Json = require('./json');
const Variable = require('./variable');

let configurations = {};

function mergeConfigurations(globalConfiguration, localConfiguration) {
    for (const key of Object.keys(localConfiguration)) {
        if (Variable.isObject(localConfiguration[key])) {
            if (!globalConfiguration[key] || !Variable.isObject(globalConfiguration[key]))
                globalConfiguration[key] = {};

            mergeConfigurations(globalConfiguration[key], localConfiguration[key]);
        } else
            globalConfiguration[key] = localConfiguration[key];
    }
}

/**
 * Load configuration as JSON from file and store in cache
 * NB : Use abslute path to avoid conflict configuration
 * 
 * @param {String} configurationPath
 * @returns {Object} configuration
 */
module.exports.getConfiguration = async configurationPath => {
    if (configurations[configurationPath])
        return configurations[configurationPath];

    const data = await File.read(configurationPath);
    configurations[configurationPath] = JSON.parse(data);
    return configurations[configurationPath];
}

/**
 * Merge global configuration with local configuration
 * NB : local configuration is priority
 * 
 * @param {Object} globalConfiguration
 * @param {Object} localConfiguration
 * @returns {Object} merged onfiguration
 */
module.exports.mergeConfigurations = (globalConfiguration, localConfiguration) => {
    globalConfiguration = Json.clone(globalConfiguration);
    mergeConfigurations(globalConfiguration, localConfiguration);
    return globalConfiguration;
}