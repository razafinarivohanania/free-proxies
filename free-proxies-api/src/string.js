const Array = require('./array');

/**
* Substring text before first/last occurence of search
* 
* @param {String} text
* @param {String} search
* @param {boolean} isLast
* @returns {String} substring value
*/
module.exports.substringBefore = (text, search, isLast) => {
    const position = isLast ?
        text.lastIndexOf(search) :
        text.indexOf(search);

    return position < 0 ?
        text :
        text.substr(0, position);
};

/**
* Substring text after first/last occurence of search
* 
* @param {String} text
* @param {String} search
* @returns {String} substring value
*/
module.exports.substringAfter = (text, search, isLast) => {
    const position = isLast ?
        text.lastIndexOf(search) :
        text.indexOf(search);

    return position < 0 ?
        '' :
        text.substring(position + search.length);
}

/**
 * Decode String encoding on base 64
 * 
 * @param {String} text
 * @param {String} decode text
 */
module.exports.decodeBase64 = text => {
    return new Buffer(text, 'base64').toString('ascii');
}

/**
 * Generate random string
 * 
 * @param {int} size
 * @param {boolean} isWithNumber
 * @param {boolean} isWithSpace
 * @returns {String} random string
 */
module.exports.generateRandomString = (size, isWithNumber, isWithSpace) => {
    if (size == 0) return;

    let template = 'abcdefghijklmnopqrstuvwxyz';
    template += template.toUpperCase();

    if (isWithNumber)
        template += '0123457689';

    if (isWithSpace)
        template += ' ';

    const arrayTemplate = [];
    for (let i = 0; i < template.length; i++)
        arrayTemplate.push(template.charAt(i));

    let randomString = '';
    for (let i = 0; i < size; i++){
        Array.shuffle(arrayTemplate);
        randomString += arrayTemplate[i];
    }

    return randomString;
}