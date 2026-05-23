/**
 * YouTube provider plugin
 * 
 * Supports parsing and URL generation for:
 * - Video URLs: youtube.com/watch?v=ID or youtu.be/ID
 * - Playlists: youtube.com/playlist?list=ID
 * - Channels: youtube.com/channel/ID or youtube.com/c/NAME
 * - Embedded videos: youtube.com/embed/ID
 * - Images: various thumbnail formats
 * 
 * @constructor
 * 
 * @example
 * // Video with start time
 * provider.parse('https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=1m30s')
 * // Returns: { id: 'aqz-KE-bpKQ', mediaType: 'video', provider: 'youtube', params: { start: 90 } }
 * 
 * @example
 * // Playlist
 * provider.parse('https://youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf')
 * // Returns: { id: 'PLrAXt...', mediaType: 'playlist', provider: 'youtube' }
 */
const {
  combineParams,
  getTime,
} = require('../util');

function YouTube() {
  /** @type {string} Provider identifier */
  this.provider = 'youtube';
  
  /** @type {string[]} Alternative domain names */
  this.alternatives = ['youtu', 'ytimg'];
  
  /** @type {string} Default URL format */
  this.defaultFormat = 'long';
  
  /** @type {Object<string, Function>} Available URL format handlers */
  this.formats = {
    short: this.createShortUrl,
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
    shortImage: this.createShortImageUrl,
    longImage: this.createLongImageUrl,
  };
  
  /** @type {Object<string, string>} Available image quality levels */
  this.imageQualities = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    DEFAULT: 'default',
    HQDEFAULT: 'hqdefault',
    SDDEFAULT: 'sddefault',
    MQDEFAULT: 'mqdefault',
    MAXRESDEFAULT: 'maxresdefault',
  };
  
  /** @type {string} Default image quality */
  this.defaultImageQuality = this.imageQualities.HQDEFAULT;
  
  /** @type {Object<string, string>} Media type constants */
  this.mediaTypes = {
    VIDEO: 'video',
    PLAYLIST: 'playlist',
    SHARE: 'share',
    CHANNEL: 'channel',
  };
}

module.exports = YouTube;

/**
 * Parse video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|undefined} 11-character video ID or undefined
 * @private
 */
YouTube.prototype.parseVideoUrl = function(url) {
  var match = url.match(
    /(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)([\w-]{11})/i
  );
  return match ? match[1] : undefined;
};

/**
 * Parse channel information from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {Object|undefined} Channel info with id/name and mediaType, or undefined
 * @private
 */
YouTube.prototype.parseChannelUrl = function(url) {
  // Match an opaque channel ID
  var match = url.match(/\/channel\/([\w-]+)/);
  if (match) {
    return { id: match[1], mediaType: this.mediaTypes.CHANNEL };
  }

  // Match a vanity channel name or a user name. User urls are deprecated and
  // currently redirect to the channel of that same name.
  match = url.match(/\/(?:c|user)\/([\w-]+)/);
  if (match) {
    return { name: match[1], mediaType: this.mediaTypes.CHANNEL };
  }
};

/**
 * Extract and normalize parameters from query string
 * @param {Record<string, string>} params - Query parameters
 * @param {Object} result - Parsing result accumulator
 * @returns {Record<string, string>} Normalized parameters
 * @private
 */
YouTube.prototype.parseParameters = function(params, result) {
  if (params.start || params.t) {
    params.start = getTime(params.start || params.t);
    delete params.t;
  }
  if (params.v === result.id) {
    delete params.v;
  }
  if (params.list === result.id) {
    delete params.list;
  }

  return params;
};

/**
 * Determine media type and normalize result
 * @param {Object} result - Parsing result accumulator
 * @returns {Object|undefined} Parsed result with mediaType set
 * @private
 */
YouTube.prototype.parseMediaType = function(result) {
  if (result.params.list) {
    result.list = result.params.list;
    delete result.params.list;
  }
  if (result.id && !result.params.ci) {
    result.mediaType = this.mediaTypes.VIDEO;
  } else if (result.list) {
    delete result.id;
    result.mediaType = this.mediaTypes.PLAYLIST;
  } else if (result.params.ci) {
    delete result.params.ci;
    result.mediaType = this.mediaTypes.SHARE;
  } else {
    return undefined;
  }
  return result;
};

/**
 * Parse YouTube URL to extract video information
 * @param {string} url - YouTube URL
 * @param {Record<string, string>} params - Query parameters
 * @returns {Object|undefined} Video information (id, mediaType, params, etc) or undefined
 */
YouTube.prototype.parse = function(url, params) {
  var channelResult = this.parseChannelUrl(url);
  if (channelResult) {
    return channelResult;
  } else {
    var result = {
      params: params,
      id: this.parseVideoUrl(url),
    };
    result.params = this.parseParameters(params, result);
    result = this.parseMediaType(result);
    return result;
  }
};

YouTube.prototype.createShortUrl = function(vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }

  var url = 'https://youtu.be/' + vi.id;
  if (params.start) {
    url += '#t=' + params.start;
  }
  return url;
};

YouTube.prototype.createLongUrl = function(vi, params) {
  var url = '';
  var startTime = params.start;
  delete params.start;

  if (vi.mediaType === this.mediaTypes.CHANNEL) {
    if (vi.id) {
      url += 'https://www.youtube.com/channel/' + vi.id;
    } else if (vi.name) {
      url += 'https://www.youtube.com/c/' + vi.name;
    } else {
      return undefined;
    }
  }
  else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list) {
    params.feature = 'share';
    url += 'https://www.youtube.com/playlist';
  }
  else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    params.v = vi.id;
    url += 'https://www.youtube.com/watch';
  }
  else if (vi.mediaType === this.mediaTypes.SHARE && vi.id) {
    params.ci = vi.id;
    url += 'https://www.youtube.com/shared';
  } else {
    return undefined;
  }

  if (vi.list) {
    params.list = vi.list;
  }

  url += combineParams(params);

  if (vi.mediaType !== this.mediaTypes.PLAYLIST && startTime) {
    url += '#t=' + startTime;
  }
  return url;
};

YouTube.prototype.createEmbedUrl = function(vi, params) {
  var url = 'https://www.youtube.com/embed';

  if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list) {
    params.listType = 'playlist';
  } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    url += '/' + vi.id;
    //loop hack
    if (params.loop === '1') {
      params.playlist = vi.id;
    }
  } else {
    return undefined;
  }

  if (vi.list) {
    params.list = vi.list;
  }

  url += combineParams(params);

  return url;
};

YouTube.prototype.createImageUrl = function(baseUrl, vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }
  var url = baseUrl + vi.id + '/';
  var quality = params.imageQuality || this.defaultImageQuality;

  return url + quality + '.jpg';
};

YouTube.prototype.createShortImageUrl = function(vi, params) {
  return this.createImageUrl('https://i.ytimg.com/vi/', vi, params);
};

YouTube.prototype.createLongImageUrl = function(vi, params) {
  return this.createImageUrl('https://img.youtube.com/vi/', vi, params);
};

require('../base').bind(new YouTube());
