/**
 * Test if variable is an array or not
 * 
 * @param {*} variable
 * @returns {boolean} result
 */
module.exports.isArray = variable => {
    return variable && variable.constructor === Array;
}

/**
 * Test if variable is an object or not
 * 
 * @param {*} variable
 * @returns {boolean} result
 */
module.exports.isObject = variable => {
    return variable && variable.constructor === Object;
}