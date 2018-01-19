'use strict';

const Influx = require('influx');

// local reference to this module
const utils = module.exports;

module.exports.send = (host, db, data) => {
    const influx = new Influx.InfluxDB({
        host: host,
        database: db
    });

    const metrics = data.lines.map(s => {
        return ({
            measurement: 'available',
            tags: { line: s.line, state: s.status },
            fields: { value: s.status == "GOOD SERVICE" ? 1 : 0,
                      current: utils.service(s.status) }
        });
    });

    return influx.writePoints(metrics);
};

module.exports.service = (text) => {
    switch(text) {
        case 'GOOD SERVICE':
            return 0;
        case 'DELAYS':
            return 2;
        case 'PLANNED WORK':
            return 3;
        case 'SERVICE CHANGE':
            return 4;
        default:
            return 1;
    }
};