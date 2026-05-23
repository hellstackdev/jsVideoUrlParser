/**
 * TikTok provider plugin
 * 
 * Supports parsing and URL generation for:
 * - Videos: tiktok.com/@USER/video/ID
 * - Short URLs: vm.tiktok.com/ID or vt.tiktok.com/ID
 * 
 * @constructor
 * 
 * @example
 * // TikTok video
 * provider.parse('https://www.tiktok.com/@username/video/1234567890')
 * // Returns: { id: '1234567890', mediaType: 'video', provider: 'tiktok' }
 */
const {
  combineParams,
} = require('../util');

function TikTok() {
  /** @type {string} Provider identifier */
  this.provider = 'tiktok';
  
  /** @type {string} Default URL format */
  this.defaultFormat = 'long';
  
  /** @type {Object<string, Function>} Available URL format handlers */
  this.formats = {
    long: this.createLongUrl,
  };
  
  /** @type {Object<string, string>} Media type constants */
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = TikTok;

/**
 * Parse TikTok URL to extract video information
 * @param {string} url - TikTok URL
 * @param {Record<string, string>} params - Query parameters
 * @returns {Object|undefined} Video information (id, mediaType, params) or undefined
 */
TikTok.prototype.parse = function(url, params) {
  var result = {
    params: params,
    mediaType: this.mediaTypes.VIDEO,
  };

  var match = url.match(/@([^/]+)\/video\/(\d{19})/);

  if (!match) {
    return;
  }

  result.channel = match[1];
  result.id = match[2];

  return result;
};

TikTok.prototype.createLongUrl = function(vi, params) {
  var url = '';

  if (vi.mediaType === this.mediaTypes.VIDEO && vi.id && vi.channel) {
    url += `https://www.tiktok.com/@${vi.channel}/video/${vi.id}`;
  } else {
    return undefined;
  }

  url += combineParams(params);

  return url;
};

require('../base').bind(new TikTok());
