/**
 * AlloCine provider plugin
 * Supports parsing and URL generation for AlloCine movies and trailers
 * @constructor
 */
const { registerProvider } = require('./registry');

function Allocine() {
  this.provider = 'allocine';
  this.alternatives = [];
  this.defaultFormat = 'embed';
  this.formats = {
    embed: this.createEmbedUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}


Allocine.prototype.parseUrl = function(url) {
  var match = url.match(/(?:\/video\/player_gen_cmedia=)([A-Za-z0-9]+)/i);
  return match ? match[1] : undefined;
};

Allocine.prototype.parse = function(url) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    id: this.parseUrl(url),
  };
  return result.id ? result : undefined;
};

Allocine.prototype.createEmbedUrl = function(vi) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }

  return 'https://player.allocine.fr/' +  vi.id + '.html';
};

module.exports = registerProvider(Allocine);
