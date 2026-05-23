/**
 * TeacherTube provider plugin
 * 
 * Supports parsing and URL generation for:
 * - Videos: teachertube.com/video/ID
 * - Audio, documents, channels, collections, and groups
 * 
 * @constructor
 */
const {
  combineParams,
} = require('../util');
const { registerProvider } = require('./registry');

function TeacherTube() {
  /** @type {string} Provider identifier */
  this.provider = 'teachertube';
  
  /** @type {string[]} Alternative domain names */
  this.alternatives = [];
  
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
    AUDIO: 'audio',
    DOCUMENT: 'document',
    CHANNEL: 'channel',
    COLLECTION: 'collection',
    GROUP: 'group',
  };
}


TeacherTube.prototype.parse = function(url, params) {
  var result = {};

  result.list = this.parsePlaylist(params);
  result.params = params;

  var match = url.match(
    /\/(audio|video|document|user\/channel|collection|group)\/(?:[\w-]+-)?(\w+)/
  );

  if (!match) {
    return undefined;
  }
  result.mediaType = this.parseMediaType(match[1]);
  result.id = match[2];

  return result;
};

TeacherTube.prototype.parsePlaylist = function(params) {
  if (params['playlist-id']) {
    var list = params['playlist-id'];
    delete params['playlist-id'];
    return list;
  }
  return undefined;
};

TeacherTube.prototype.parseMediaType = function(mediaTypeMatch) {
  switch (mediaTypeMatch) {
  case 'audio':
    return this.mediaTypes.AUDIO;
  case 'video':
    return this.mediaTypes.VIDEO;
  case 'document':
    return this.mediaTypes.DOCUMENT;
  case 'user/channel':
    return this.mediaTypes.CHANNEL;
  case 'collection':
    return this.mediaTypes.COLLECTION;
  case 'group':
    return this.mediaTypes.GROUP;
  }
};

TeacherTube.prototype.createLongUrl = function(vi, params) {
  if (!vi.id) {
    return undefined;
  }
  var url = 'https://www.teachertube.com/';

  if (vi.list) {
    params['playlist-id'] = vi.list;
  }

  if (vi.mediaType === this.mediaTypes.CHANNEL) {
    url += 'user/channel/';
  } else {
    url += vi.mediaType + '/';
  }
  url += vi.id;

  url += combineParams(params);

  return url;
};

TeacherTube.prototype.createEmbedUrl = function(vi, params) {
  if (!vi.id) {
    return undefined;
  }

  var url = 'https://www.teachertube.com/embed/';

  if (vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.AUDIO) {
    url += vi.mediaType + '/' + vi.id;
  } else {
    return undefined;
  }

  url += combineParams(params);

  return url;
};

module.exports = registerProvider(TeacherTube);
