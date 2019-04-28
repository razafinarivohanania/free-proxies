const fs = require('fs');

/**
 * Read file as text by providing file path
 * 
 * @param {String} filePath
 * @return {Promise<String>} content
 */
module.exports.read = async filePath => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, data) => {
            if (error)
                reject(error);
            else
                resolve('' + data);
        });
    });
}

/**
 * Write data into file according to file path
 * 
 * @param {String} filePath
 * @param {*} data
 * @returns {Promise<void>}
 */
module.exports.write = async (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, error => {
            if (error)
                reject(error);
            else
                resolve();
        });
    });
}

/**
 * Remove file by providing path
 * 
 * @param {String} filePath
 * @returns {Promise<void>}
 */
module.exports.remove = filePath => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, error => {
            if (error)
                reject(error);
            else
                resolve();
        });
    });
}