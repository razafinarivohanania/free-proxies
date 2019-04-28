const sqlite3 = require('sqlite3').verbose();

class ProxyDataBase {

    /**
     * Init database especially to create proxy table when it is absent
     * 
     * @param {String} dataBasePath 
     * @return {Promise} 
     */
    initDatabase(dataBasePath) {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(dataBasePath);
            this.db.run('CREATE TABLE IF NOT EXISTS proxy (id TEXT, ip TEXT, port INTEGER, country TEXT, state INT, provider TEXT)', error => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }

    /**
     * Store proxy in database if it is not already exist
     * 
     * @param {Object} proxy
     * @returns {Promise}
     */
    addProxy(proxy) {
        return new Promise(async (resolve, reject) => {
            const proxyExists = await this.isProxyExists(proxy);
            if (proxyExists) {
                resolve();
                return;
            }

            this.db.run('INSERT INTO proxy (id, ip, port, country, state, provider) VALUES ($id, $ip, $port, $country, $state, $provider)', {
                $id: `${proxy.ip}:${proxy.port}`,
                $ip: proxy.ip,
                $port: proxy.port,
                $country: proxy.country.toUpperCase(),
                $state: proxy.state,
                $provider: proxy.provider
            }, error => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }

    /**
     * Store proxies in database by excluding existing proxy
     * 
     * @param {Array} proxies
     */
    async addProxies(proxies) {
        for (const proxy of proxies)
            await addProxy(proxy);
    }

    /**
     * Check if proxy exists in database
     * 
     * @param {Object} proxy
     * @returns {Promise}
     */
    isProxyExists(proxy) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT ip FROM proxy WHERE ip = $ip AND port = $port LIMIT 1', {
                $ip: proxy.ip,
                $port: proxy.port
            }, (error, row) => {
                if (error)
                    reject(error);
                else
                    resolve(!!row);
            });
        });
    }

    /**
     * Remove proxy from database from matching ip and port
     * 
     * @param {Object} proxy
     * @returns {Promise}
     */
    removeProxy(proxy) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM proxy WHERE ip = $ip AND port = $port', {
                $ip: proxy.ip,
                $port: proxy.port
            }, error => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        })
    }

    /**
     * Set state of proxy as good (equals to 1) based on ip and port
     * 
     * @param {Object} proxy
     * @returns {Promise} 
     */
    setProxyGood(proxy) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE proxy SET state = 1 WHERE ip = $ip AND port = $port', {
                $ip: proxy.ip,
                $port: proxy.port
            }, error => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }

    /**
     * Set country of proxy based on ip and port
     * 
     * @param {Object} proxy
     * @returns {Promise}
     */
    setProxyCountry(proxy) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE proxy SET country = $country WHERE ip = $ip AND port = $port', {
                $country: proxy.country.toUpperCase(),
                $ip: proxy.ip,
                $port: proxy.port
            }, error => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }

    /**
     * Fetch one random good proxy from database
     * 
     * @param {String} country 
     * @param {String} provider 
     * @returns {Promise<Object>} proxy
     */
    getRandomGoodProxy(country, provider) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM proxy WHERE state = 1';
            const parameters = {};
            if (country) {
                sql += ' AND country = $country';
                parameters.$country = country;
            }

            if (provider) {
                sql += ' AND provider = $provider';
                parameters.$provider = provider;
            }

            sql += ' ORDER BY RANDOM() LIMIT 1';

            const next = (error, row) => {
                if (error)
                    reject(error);
                else
                    resolve(row);
            };

            if (Object.keys(parameters).length)
                this.db.get(sql, parameters, next);
            else
                this.db.get(sql, next);
        });
    }

    /**
     * Fetch proxies from database
     * 
     * @param {String} country
     * @param {int} state
     * @param {String} provider
     * @returns {Array} proxies
     */
    getProxies(country, state, provider) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM proxy';

            const fields = {
                country: country,
                state: state,
                provider: provider
            };

            const where = [];
            const parameters = {};
            for (const name of Object.keys(fields)) {
                let field = fields[name];
                if (!field) continue;

                where.push(name + ' = $' + name);
                if (name === 'country')
                    field = field.toUpperCase();
                
                parameters['$' + name] = field;
            }

            if (where.length)
                sql += ' WHERE ' + where.join(' AND ');

            const result = (error, rows) => {
                if (error)
                    reject(error);
                else
                    resolve(rows);
            }

            if (Object.keys(parameters).length)
                this.db.all(sql, parameters, result);
            else
                this.db.all(sql, result);
        });
    }

    /**
     * Close database in order to free memory and liberate database file
     * 
     * @returns {Promise}
     */
    close() {
        return new Promise((resolve, reject) => {
            this.db.close(error => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }
}

module.exports = ProxyDataBase;