'use strict';

const request = require('request-promise-native');

module.exports.retrieve = (url) => {
    const options = {
        url: url,
        method: 'GET'
    };

    return request(options).promise();
};