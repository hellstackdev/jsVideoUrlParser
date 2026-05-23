/**
 * Template provider plugin
 * 
 * Reference implementation showing provider structure and methods.
 * Copy this as a template when adding new providers.
 * 
 * Implements standard provider interface:
 * - provider: identifier string
 * - alternatives: alternate domain names
 * - defaultFormat: default URL format name
 * - formats: map of format functions
 * - mediaTypes: map of media type constants
 * - parse(url, params): extract video info from URL
 * 
 * @constructor
 * 
 * @example
 * // To use as template:
 * // 1. Copy lib/provider/template.js to lib/provider/myprovider.js
 * // 2. Replace all function/class names
 * // 3. Update provider, alternatives, mediaTypes
 * // 4. Implement parse() and format functions
 * // 5. Add require() in lib/index.js
 */
const {
  combineParams,
  getTime,
} = require('../util');

function Template() {
  /** @type {string} Provider identifier */
  this.provider = 'template';
  
  /** @type {string[]} Alternative domain names (e.g., shortened versions) */
  this.alternatives = ['temp'];
  
  /** @type {string} Default format when creating URLs */
  this.defaultFormat = 'long';
  
  /** @type {Object<string, Function>} Available URL format handlers */
  this.formats = {
    long: this.createLongUrl,
    short: this.createShortUrl,
  };
  
  /** @type {Object<string, string>} Media type constants */
  this.mediaTypes = {
    VIDEO: 'video',
    PLAYLIST: 'playlist',
  };
}

module.exports = Template;

Template.prototype.parse = function(url, params) {
  //Set up the videoInfo object with relevant information
  var result = {
    params: params,
    mediaType: this.mediaTypes.VIDEO,
  };

  //Parse the url with regex or the query parameters might contain the id
  var match = url.match(
    /com\/(?:example\/id\/)?([\w-]+)/
  );
  result.id = match ? match[1] : params.id;

  //Parse time parameters to turn it from the string 1m30s into the number 90
  if (params.start) {
    result.params.start = getTime(params.start);
  }

  //Return nothing when parsing failed
  if (!result.id) {
    return undefined;
  }

  return result;
};

Template.prototype.createLongUrl = function(vi, params) {
  var url = '';

  //Create the url depending on the media type
  if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    url += 'https://template.com/example/id/' + vi.id;
  } else {
    return undefined;
  }

  //Add query parameters back e.g.
  //https://template.com/example/id/abcde?foo=bar&baz=qux
  url += combineParams(params);

  return url;
};

Template.prototype.createShortUrl = function(vi, params) {
  var url = '';

  //Create shortened urls
  if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    url += 'https://temp.com/' + vi.id;
  } else {
    return undefined;
  }

  url += combineParams(params);

  return url;
};

require('../base').bind(new Template());