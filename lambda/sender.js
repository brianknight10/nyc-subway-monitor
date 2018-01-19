'use strict';

const influx = require('./lib/influx');

module.exports.handler = (event, context, callback) => {
    const host = process.env.influxHost;
    const db = process.env.influxDb;
    const status = event.payload;

    if (!status) {
        const error = new Error('Missing or empty event payload');
        callback(error);
        throw error;
    }

    return Promise.resolve()
        .then(() => {
            const res = influx.send(host, db, status);
            Promise.resolve(res);
        })
        .then(() => callback(null, 'OK'))
        .catch((err) => callback(err, null));
};