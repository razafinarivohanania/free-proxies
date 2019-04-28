const fs = require('fs');

/**
 * Get state of entering path
 * 
 * @param {String} path 
 * @returns {Promise<Stats>} stats
 */
function getStats(path) {
    return new Promise(resolve => {
        fs.stat(path, (error, stats) => {
            if (error) {
                resolve({ error: error });
            } else
                resolve(stats);
        });
    });
}

/**
 * Create directory by providing path
 * 
 * @param {String} directoryPath
 * @returns {Promise<void>}
 */
function create(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.mkdir(directoryPath, error => {
            if (error)
                reject(error);
            else
                resolve();
        });
    });
}

/**
 * Create directory if it doesn't exist again
 * 
 * @param {String} directoryPath
 */
module.exports.createIfAbsent = async directoryPath => {
    const stats = await getStats(directoryPath);
    if (stats.error) {
        if (stats.error.code === 'ENOENT') {
            await create(directoryPath);
            return;
        }

        throw stats.error;
    }
}