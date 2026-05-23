/**
 * @typedef {Object} QueryParams
 * @property {string} [key] - Query parameter values
 */

/**
 * @typedef {Object} VideoInfo
 * @property {string} id - The video/media ID (provider-specific)
 * @property {string} mediaType - Type of media (e.g., 'video', 'audio', 'playlist', 'channel')
 * @property {string} provider - Provider name (e.g., 'youtube', 'vimeo')
 * @property {QueryParams} [params] - Additional parameters extracted from URL
 * @property {string} [list] - Optional list/playlist ID
 * @property {string} [name] - Optional name for channels or handles
 */

/**
 * @typedef {Object} CreateOptions
 * @property {VideoInfo} videoInfo - Video information to recreate URL from
 * @property {QueryParams} [params] - Parameters to apply ('internal' for original params)
 * @property {string} [format] - URL format (e.g., 'short', 'long', 'embed')
 */

/**
 * @typedef {Object} Provider
 * @property {string} provider - Unique provider identifier
 * @property {string[]} [alternatives] - Alternative provider names
 * @property {string} defaultFormat - Default URL format
 * @property {Object<string, Function>} formats - Format functions (shortUrl, longUrl, etc)
 * @property {Function} parse - Parse URL to VideoInfo
 */

const {
  getQueryParams,
} = require('./util');

/**
 * URL Parser for extracting video information from various provider URLs
 * @constructor
 */
function UrlParser() {
  for (const key of [
    'parseProvider',
    'parse',
    'bind',
    'create',
  ]) {
    this[key] = this[key].bind(this);
  }
  /** @type {Object<string, Provider>} Registered provider plugins */
  this.plugins = {};
}

module.exports = UrlParser;

/**
 * Extract provider name from URL
 * @param {string} url - URL to parse
 * @returns {string|undefined} Provider name or undefined if not found
 */
UrlParser.prototype.parseProvider = function(url) {
  var match = url.match(
    /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(\w+)\./i
  );
  return match ? match[1] : undefined;
};

/**
 * Parse URL and extract video information
 * @param {string} url - URL to parse
 * @returns {VideoInfo|undefined} Parsed video information or undefined if not parseable
 */
UrlParser.prototype.parse = function(url) {
  if (typeof url === 'undefined') {
    return undefined;
  }
  var provider = this.parseProvider(url);
  var result;
  var plugin = this.plugins[provider];
  if (!provider || !plugin || !plugin.parse) {
    return undefined;
  }
  result = plugin.parse.call(
    plugin, url, getQueryParams(url)
  );
  if (result) {
    result = removeEmptyParameters(result);
    result.provider = plugin.provider;
  }
  return result;
};

/**
 * Register a provider plugin with the parser
 * @param {Provider} plugin - Provider plugin to register
 * @returns {void}
 */
UrlParser.prototype.bind = function(plugin) {
  this.plugins[plugin.provider] = plugin;
  if (plugin.alternatives) {
    for (var i = 0; i < plugin.alternatives.length; i += 1) {
      this.plugins[plugin.alternatives[i]] = plugin;
    }
  }
};

/**
 * Reconstruct a URL from video information
 * @param {CreateOptions} op - Options with VideoInfo and format
 * @returns {string|undefined} Reconstructed URL or undefined if format not available
 */
UrlParser.prototype.create = function(op) {
  if (typeof (op) !== 'object' || typeof (op.videoInfo) !== 'object') {
    return undefined;
  }

  var vi = op.videoInfo;
  var params = op.params;
  var plugin = this.plugins[vi.provider];

  params = (params === 'internal') ? vi.params : params || {};

  if (plugin) {
    op.format = op.format || plugin.defaultFormat;
    // eslint-disable-next-line no-prototype-builtins
    if (plugin.formats.hasOwnProperty(op.format)) {
      return plugin.formats[op.format].apply(plugin, [vi, Object.assign({}, params)]);
    }
  }
  return undefined;
};

/**
 * Remove empty parameter objects from video info
 * @param {VideoInfo} result - Video information
 * @returns {VideoInfo} Video info with empty params removed
 * @private
 */
function removeEmptyParameters(result) {
  if (result.params && Object.keys(result.params).length === 0) {
    delete result.params;
  }
  return result;
}