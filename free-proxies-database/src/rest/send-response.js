/**
 * Finalize response by checking error
 * 
 * @param {Response} res
 * @param {String} error
 * @param {Object} data 
 */
module.exports = (res, error, data) => {
    const response = {};

    res.setHeader('Content-Type', 'application/json');

    if (error) {
        response.success = false;
        response.error = error;
        res.send(JSON.stringify(response, null, 3));
    } else {
        if (typeof data != 'object' || data == null)
            data = {};

        data.success = true;
        res.send(JSON.stringify(data, null, 3));
    }
}