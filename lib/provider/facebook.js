/**
 * Facebook provider plugin
 * 
 * Supports parsing and URL generation for:
 * - Videos: facebook.com/watch/?v=ID or fb.watch/ID
 * - Page videos: facebook.com/PAGE/videos/ID
 * 
 * @constructor
 * 
 * @example
 * // Facebook video
 * provider.parse('https://www.facebook.com/watch/?v=1234567890')
 * // Returns: { id: '1234567890', mediaType: 'video', provider: 'facebook' }
 */
const {
  combineParams,
} = require('../util');
const { registerProvider } = require('./registry');

function Facebook() {
  /** @type {string} Provider identifier */
  this.provider = 'facebook';
  
  /** @type {string[]} Alternative domain names */
  this.alternatives = [];
  
  /** @type {string} Default URL format */
  this.defaultFormat = 'long';
  
  /** @type {Object<string, Function>} Available URL format handlers */
  this.formats = {
    long: this.createLongUrl,
    watch: this.createWatchUrl,
  };
  
  /** @type {Object<string, string>} Media type constants */
  this.mediaTypes = {
    VIDEO: 'video',
  };
}


/**
 * Parse Facebook URL to extract video information
 * @param {string} url - Facebook URL
 * @param {Record<string, string>} params - Query parameters
 * @returns {Object|undefined} Video information (id, mediaType, params) or undefined
 */
Facebook.prototype.parse = function(url, params) {
  var result = {
    params: params,
    mediaType: this.mediaTypes.VIDEO,
  };

  var match = url.match(/(?:\/(\d+))?\/videos(?:\/.*?)?\/(\d+)/i);
  if (match) {
    if (match[1]) {
      result.pageId = match[1];
    }
    result.id = match[2];
  }
  if (params.v && !result.id) {
    result.id = params.v;
    delete params.v;
    result.params = params;
  }

  if (!result.id) {
    return undefined;
  }

  return result;
};

Facebook.prototype.createWatchUrl = function(vi, params) {
  var url = 'https://facebook.com/watch/';

  if (vi.mediaType !== this.mediaTypes.VIDEO || !vi.id) {
    return undefined;
  }
  params = { v: vi.id };
  url += combineParams(params);

  return url;
};

Facebook.prototype.createLongUrl = function(vi, params) {
  var url = 'https://facebook.com/';

  if (vi.pageId) {
    url += vi.pageId;
  } else {
    return undefined;
  }

  if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    url += '/videos/' + vi.id;
  } else {
    return undefined;
  }

  url += combineParams(params);

  return url;
};

module.exports = registerProvider(Facebook);
