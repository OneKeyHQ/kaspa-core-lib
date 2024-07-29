'use strict';

var _ = require('lodash');
var logLevels = require('./log').logLevels;
var BN = require('../crypto/bn');

const UINT64_MAX = new BN('18446744073709551615');

/**
 * Determines whether a string contains only hexadecimal values
 *
 * @name JSUtil.isHexa
 * @param {string} value
 * @return {boolean} true if the string is the hexa representation of a number
 */
var isHexa = function isHexa(value) {
    if (!_.isString(value)) {
        return false;
    }
    return /^[0-9a-fA-F]+$/.test(value);
};

/**
 * @namespace JSUtil
 */
const JSUtil = {
    debugLevel:0,
    LogBufferActive: false,
    LogBuffer(...args) {
        if (!JSUtil.LogBufferActive || JSUtil.debugLevel < logLevels.debug)
            return
        args[args.length - 1] = args[args.length - 1].map(buf => buf.toString("hex"));
        console.log(...args)
    },
    /**
     * Test if an argument is a valid JSON object. If it is, returns a truthy
     * value (the json object decoded), so no double JSON.parse call is necessary
     *
     * @param {string} arg
     * @return {Object|boolean} false if the argument is not a JSON string.
     */
    isValidJSON: function isValidJSON(arg) {
        var parsed;
        if (!_.isString(arg)) {
            return false;
        }
        try {
            parsed = JSON.parse(arg);
        } catch (e) {
            return false;
        }
        if (typeof(parsed) === 'object') {
            return true;
        }
        return false;
    },
    isHexa: isHexa,
    isHexaString: isHexa,

    /**
     * Clone an array
     */
    cloneArray: function(array) {
        return [].concat(array);
    },

    /**
     * Define immutable properties on a target object
     *
     * @param {Object} target - An object to be extended
     * @param {Object} values - An object of properties
     * @return {Object} The target object
     */
    defineImmutable: function defineImmutable(target, values) {
        Object.keys(values).forEach(function(key) {
            Object.defineProperty(target, key, {
                configurable: false,
                enumerable: true,
                value: values[key]
            });
        });
        return target;
    },
    /**
     * Checks that a value is a natural number, a positive integer or zero.
     *
     * @param {*} value
     * @return {Boolean}
     */
    isNaturalNumber: function isNaturalNumber(value) {
        if (typeof value === 'string') {
            if (!/^\d*$/.test(value)) {
                return false;
            }
        }

        if(typeof value === 'number' || typeof value === 'string'){
            try {
                var bnValue = BN.fromNumber(value);
                return bnValue.lte(UINT64_MAX);
            } catch (e) {
                return false;
            }
        }

        return false;
    }
};

module.exports = JSUtil;