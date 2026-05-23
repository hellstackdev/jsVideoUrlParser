/**
 * Dailymotion provider plugin
 * 
 * Supports parsing and URL generation for:
 * - Videos: dailymotion.com/video/ID or dai.ly/ID
 * - With start times and parameters
 * 
 * @constructor
 * 
 * @example
 * // Simple video
 * provider.parse('https://dailymotion.com/video/x12345ab')
 * // Returns: { id: 'x12345ab', mediaType: 'video', provider: 'dailymotion' }
 */
const { combineParams, getTime } = require('../util');

function Dailymotion() {
  /** @type {string} Provider identifier */
  this.provider = 'dailymotion';
  
  /** @type {string[]} Alternative domain names */
  this.alternatives = ['dai'];
  
  /** @type {string} Default URL format */
  this.defaultFormat = 'long';
  
  /** @type {Object<string, Function>} Available URL format handlers */
  this.formats = {
    short: this.createShortUrl,
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
    image: this.createImageUrl,
  };
  
  /** @type {Object<string, string>} Media type constants */
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = Dailymotion;

/**
 * Extract and normalize parameters from query string
 * @param {Record<string, string>} params - Query parameters
 * @returns {Record<string, string>} Normalized parameters
 * @private
 */
Dailymotion.prototype.parseParameters = function(params) {
  return this.parseTime(params);
};

/**
 * Parse time parameter to seconds
 * @param {Record<string, string>} params - Query parameters
 * @returns {Record<string, string>} Parameters with parsed time
 * @private
 */
Dailymotion.prototype.parseTime = function(params) {
  if (params.start) {
    params.start = getTime(params.start);
  }
  return params;
};

Dailymotion.prototype.parseUrl = function(url) {
  var match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
  return match ? match[1] : undefined;
};

Dailymotion.prototype.parse = function(url, params) {
  var _this = this;
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: _this.parseParameters(params),
    id: _this.parseUrl(url),
  };
  return result.id ? result : undefined;
};

Dailymotion.prototype.createUrl = function(base, vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }
  return base + vi.id + combineParams(params);
};

Dailymotion.prototype.createShortUrl = function(vi, params) {
  return this.createUrl('https://dai.ly/', vi, params);
};

Dailymotion.prototype.createLongUrl = function(vi, params) {
  return this.createUrl('https://dailymotion.com/video/', vi, params);
};

Dailymotion.prototype.createEmbedUrl = function(vi, params) {
  return this.createUrl('https://www.dailymotion.com/embed/video/', vi, params);
};

Dailymotion.prototype.createImageUrl = function(vi, params) {
  delete params.start;
  return this.createUrl('https://www.dailymotion.com/thumbnail/video/', vi, params);
};

require('../base').bind(new Dailymotion());
