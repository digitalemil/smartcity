'use strict';

var assert = require('chai').assert,
    pollution = require('../src/pollution');

describe('buildUrlPath', function() {
    it ('should return hourly url path no site', function() {
        assert.equal('Hourly/MonitoringIndex/GroupName=London/Json', pollution.buildUrlPath());
    });

    it ('should return hourly url path with site', function() {
        assert.equal('Hourly/MonitoringIndex/SiteCode=BG2/Json', pollution.buildUrlPath('BG2'));
    });
});

describe('getHourlyPollutionLevel', function() {
    it ('should return a response', function(done) {
        pollution.getHourlyPollutionLevels('BG1', function(error, result) {
            assert.isNotNull(result);
            done();
        });
    });
});
