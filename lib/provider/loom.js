/**
 * Loom provider plugin
 * Supports parsing and URL generation for Loom recordings
 * @constructor
 */
const { combineParams } = require('../util');
const { registerProvider } = require('./registry');

function Loom() {
  this.provider = 'loom';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}


Loom.prototype.parseUrl = function(url) {
  var match = url.match(
    /(?:share|embed)\/([a-zA-Z\d]+)/i
  );
  return match ? match[1] : undefined;
};

Loom.prototype.parse = function(url, params) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: params,
    id: this.parseUrl(url),
  };
  return result.id ? result : undefined;
};

Loom.prototype.createUrl = function(baseUrl, vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }

  var url = baseUrl + vi.id;
  url += combineParams(params);
  return url;
};

Loom.prototype.createLongUrl = function(vi, params) {
  return this.createUrl('https://loom.com/share/', vi, params);
};

Loom.prototype.createEmbedUrl = function(vi, params) {
  return this.createUrl('//loom.com/embed/', vi, params);
};

module.exports = registerProvider(Loom);
