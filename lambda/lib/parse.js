'use strict';

const xml2js = require('xml2js-es6-promise');

module.exports.xmlToJs = (xml) => {
    return xml2js(xml);
};

module.exports.parseSubway = (data) => {
    const lines = () => {
        return data.service.subway[0].line.map(l => ({ line: l.name[0], status: l.status[0] }));
    };

    return { lines: lines() };
};
