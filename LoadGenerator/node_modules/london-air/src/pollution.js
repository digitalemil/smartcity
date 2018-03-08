'use strict';

var urlHelper = require('./UrlHelper'),
    request = require('request'),
    client = require('./client');

var pollution = {};

pollution.getHourlyPollutionLevels = function(siteCode, callback) {
    var path = this.buildUrlPath(siteCode);
    client.makeRequest(path, callback);
};

pollution.buildUrlPath = function(siteCode) {
    var url = 'Hourly/MonitoringIndex/GroupName=London/Json';

    if (siteCode) {
        url = 'Hourly/MonitoringIndex/SiteCode=' + siteCode + '/Json';
    }

    return url;
};

module.exports = pollution;
