'use strict';

var urlHelper = require('./UrlHelper'),
    request = require('request');

var client = {};

client.makeRequest = function(path, handleResponse) {
    var url = urlHelper.buildUrl(path);

    request(url, function(error, response, body) {
        if (error) {
            return handleResponse(error);
        }

        return handleResponse(null, body);
    });
};

module.exports = client;
