/**
 * Vimeo provider plugin
 * 
 * Supports parsing and URL generation for:
 * - Video URLs: vimeo.com/ID or vimeopro.com/...
 * - Channels: vimeo.com/channels/NAME/ID
 * - Albums: vimeo.com/album/ID/video/ID
 * - Groups: vimeo.com/groups/NAME/videos/ID
 * - Showcases: vimeo.com/showcase/ID/video/ID
 * - Private videos with hash tokens
 * 
 * @constructor
 * 
 * @example
 * // Simple video
 * provider.parse('https://vimeo.com/96063277')
 * // Returns: { id: '96063277', mediaType: 'video', provider: 'vimeo' }
 * 
 * @example
 * // Video with start time and hash
 * provider.parse('https://vimeo.com/96063277/abc123?t=1m30s')
 * // Returns: { id: '96063277', mediaType: 'video', params: { start: 90, hash: 'abc123' } }
 */
const { combineParams, getTime } = require('../util');
const { registerProvider } = require('./registry');

function Vimeo() {
  /** @type {string} Provider identifier */
  this.provider = 'vimeo';
  
  /** @type {string[]} Alternative domain names */
  this.alternatives = ['vimeopro'];
  
  /** @type {string} Default URL format */
  this.defaultFormat = 'long';
  
  /** @type {Object<string, Function>} Available URL format handlers */
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
  };
  
  /** @type {Object<string, string>} Media type constants */
  this.mediaTypes = {
    VIDEO: 'video',
  };
}


/**
 * Parse video ID from Vimeo URL
 * @param {string} url - Vimeo URL
 * @returns {string|undefined} Video ID or undefined
 * @private
 */
Vimeo.prototype.parseUrl = function(url) {
  var match = url.match(
    /(?:\/showcase\/\d+)?(?:\/(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+)\/)?videos?))?\/(\d+)/i
  );
  return match ? match[1] : undefined;
};

/**
 * Parse hash token for private videos
 * @param {string} url - Vimeo URL
 * @returns {string|undefined} Hash token or undefined
 * @private
 */
Vimeo.prototype.parseHash = function(url) {
  var match = url.match(/\/\d+\/(\w+)$/i);
  return match ? match[1] : undefined;
};

/**
 * Extract and normalize parameters from query string
 * @param {Record<string, string>} params - Query parameters
 * @returns {Record<string, string>} Normalized parameters
 * @private
 */
Vimeo.prototype.parseParameters = function(params) {
  if (params.t) {
    params.start = getTime(params.t);
    delete params.t;
  }
  if (params.h) {
    params.hash = params.h;
    delete params.h;
  }
  return params;
};

/**
 * Parse Vimeo URL to extract video information
 * @param {string} url - Vimeo URL
 * @param {Record<string, string>} params - Query parameters
 * @returns {Object|undefined} Video information (id, mediaType, params, etc) or undefined
 */
Vimeo.prototype.parse = function(url, params) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: this.parseParameters(params),
    id: this.parseUrl(url),
  };
  var hash = this.parseHash(url, params);
  if (hash) {
    result.params.hash = hash;
  }
  return result.id ? result : undefined;
};

Vimeo.prototype.createUrl = function(baseUrl, vi, params, type) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }

  var url = baseUrl + vi.id;
  var startTime = params.start;
  delete params.start;

  if (params.hash) {
    if (type === 'embed') {
      params.h = params.hash;
    } else if (type === 'long') {
      url += '/' + params.hash;
    }
    delete params.hash;
  }

  url += combineParams(params);

  if (startTime) {
    url += '#t=' + startTime;
  }
  return url;
};

Vimeo.prototype.createLongUrl = function(vi, params) {
  return this.createUrl('https://vimeo.com/', vi, params, 'long');
};

Vimeo.prototype.createEmbedUrl = function(vi, params) {
  return this.createUrl('//player.vimeo.com/video/', vi, params, 'embed');
};

module.exports = registerProvider(Vimeo);
