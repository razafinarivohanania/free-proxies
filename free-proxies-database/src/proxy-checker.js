module.exports = {

    /**
     * Check IP
     * Return error when something is wrong
     * 
     * @return {String} error
     */
    checkIp: ip => {
        if (!ip)
            return "'ip' is blank";

        const error = `'ip' with value '${ip}' is invalid`;
        const data = ip.split('.');
        if (!data || data.length != 4)
            return error;

        for (let part of data) {
            if (!/^\d+$/.test(part))
                return error;

            part = +part;
            if (part > 255)
                return error;
        }
    },

    /**
     * Check port
     * Return error when something is wrong
     * 
     * @return {String} error
     */
    checkPort: port => {
        if (!port)
            return "'port' is blank";

        if (!/^\d+$/.test(port) || port > 65535)
            return `'port' with value '${port}' is invalid`;
    },

    /**
     * Check state
     * Return error when something is wrong
     * 
     * @return {String} error
     */
    checkState: state => {
        if (!state)
            return "'state' is blank";

        state = +state;
        if (state < 0 || state > 1)
            return `'state' with value '${state}' is invalid`;
    },

    /**
     * Check country
     * Return error when something is wrong
     * 
     * @return {String} error
     */
    checkCountry: country => {
        if (!country || country === "''" || country === '""')
            return "'country' is blank";

        if (!/^[a-zA-Z]{2}$/.test(country))
            return `'country' with value '${country}' is invalid`;
    },

    /**
     * Check provider
     * Return error when something is wrong
     * 
     * @return {String} error
     */
    checkProvider: provider => {
        if (!provider)
            return "'provider' is blank";
    }
}