/**
 * Clone JSON into new variable
 * 
 * @param {JSON} json
 * @returns {JSON} cloned json
 */
module.exports.clone = json => {
    const data = JSON.stringify(json);
    return JSON.parse(data);
}