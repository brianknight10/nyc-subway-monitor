'use strict';

const mta = require('./lib/http');
const parse = require('./lib/parse');

module.exports.handler = (event, context, callback) => {
    const url = process.env.statusUrl;

    return Promise.resolve()
        .then(() => {
            const statuses = mta.retrieve(url);
            return Promise.resolve(statuses); 
        })
        .then((data) => {
            const statusJson = parse.xmlToJs(data);
            return Promise.resolve(statusJson);
        })
        .then((data) => {
            const statuses = parse.parseSubway(data);
            return Promise.resolve(statuses);
        })
        .then((data) => callback(null, data))
        .catch((err) => callback(err));
};
