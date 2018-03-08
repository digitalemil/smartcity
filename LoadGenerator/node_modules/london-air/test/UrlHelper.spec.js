'use strict';

var assert = require('assert'),
    urlHelper = require('../src/UrlHelper');

describe('build Url', function() {
    it ('should pull the config and build the final url', function() {
        assert.equal('http://api.erg.kcl.ac.uk/AirQuality/test', urlHelper.buildUrl('test'));
    });
});
