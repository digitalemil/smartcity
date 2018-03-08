'use strict';

var assert = require('chai').assert,
    healthMessage = require('../src/HealthMessage');

describe('Health Url Path', function() {
    it('should return the correct url path', function() {
        assert.equal('Information/IndexHealthAdvice/Json', healthMessage.getUrlPath());
    });
});

describe('All Health Messages Request', function() {
    it('should return a response', function() {
        healthMessage.getAllHealthMessages(function(error, result) {
            assert.isNotNull(result);
            done();
        });
    });
});
