'use strict';

var config = require('./config');

var urlHelper = {};

urlHelper.buildUrl = function(path) {
    return config.baseUrl + path;
};

module.exports = urlHelper;
