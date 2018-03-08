'use strict';

var urlHelper = require('./UrlHelper'),
    request = require('request'),
    client = require('./client');

var healthMessage = {};

healthMessage.getUrlPath = function() {
    return 'Information/IndexHealthAdvice/Json';
};

healthMessage.getAllHealthMessages = function(handleResponse) {
    var path = this.getUrlPath();
    client.makeRequest(path, handleResponse);
};

module.exports = healthMessage;
