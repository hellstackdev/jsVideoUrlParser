(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.urlParser = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function _typeof(o) {
	  "@babel/helpers - typeof";

	  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
	    return typeof o;
	  } : function (o) {
	    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	  }, _typeof(o);
	}

	var util = {};

	var hasRequiredUtil;
	function requireUtil() {
	  if (hasRequiredUtil) return util;
	  hasRequiredUtil = 1;
	  util.getQueryParams = function getQueryParams(qs) {
	    if (typeof qs !== 'string') {
	      return {};
	    }
	    qs = qs.split('+').join(' ');
	    var params = {};
	    var match = qs.match(/(?:[?](?:[^=]+)=(?:[^&#]*)(?:[&](?:[^=]+)=(?:[^&#]*))*(?:[#].*)?)|(?:[#].*)/);
	    var split;
	    if (match === null) {
	      return {};
	    }
	    split = match[0].substr(1).split(/[&#=]/);
	    for (var i = 0; i < split.length; i += 2) {
	      params[decodeURIComponent(split[i])] = decodeURIComponent(split[i + 1] || '');
	    }
	    return params;
	  };

	  /**
	   * Combine parameters into a URL query string
	   * @param {Record<string, string>} params - Parameters to combine
	   * @param {boolean} [hasParams] - Whether URL already has parameters
	   * @returns {string} Combined query string (e.g., '?key=value&key2=value2')
	   */
	  util.combineParams = function combineParams(params, hasParams) {
	    if (_typeof(params) !== 'object') {
	      return '';
	    }
	    var combined = '';
	    var i = 0;
	    var keys = Object.keys(params);
	    if (keys.length === 0) {
	      return '';
	    }

	    //always have parameters in the same order
	    keys.sort();
	    if (!hasParams) {
	      combined += '?' + keys[0] + '=' + params[keys[0]];
	      i += 1;
	    }
	    for (; i < keys.length; i += 1) {
	      combined += '&' + keys[i] + '=' + params[keys[i]];
	    }
	    return combined;
	  };

	  //parses strings like 1h30m20s to seconds
	  /**
	   * Parse time format like "1h30m20s" to seconds
	   * @param {string} timeString - Time in format like "1h30m20s"
	   * @returns {number} Total time in seconds
	   * @private
	   */
	  function getLetterTime(timeString) {
	    var totalSeconds = 0;
	    var timeValues = {
	      's': 1,
	      'm': 1 * 60,
	      'h': 1 * 60 * 60,
	      'd': 1 * 60 * 60 * 24,
	      'w': 1 * 60 * 60 * 24 * 7
	    };
	    var timePairs;

	    //expand to "1 h 30 m 20 s" and split
	    timeString = timeString.replace(/([smhdw])/g, ' $1 ').trim();
	    timePairs = timeString.split(' ');
	    for (var i = 0; i < timePairs.length; i += 2) {
	      totalSeconds += parseInt(timePairs[i], 10) * timeValues[timePairs[i + 1] || 's'];
	    }
	    return totalSeconds;
	  }

	  //parses strings like 1:30:20 to seconds
	  /**
	   * Parse time format like "1:30:20" to seconds
	   * @param {string} timeString - Time in colon-separated format
	   * @returns {number} Total time in seconds
	   * @private
	   */
	  function getColonTime(timeString) {
	    var totalSeconds = 0;
	    var timeValues = [1, 1 * 60, 1 * 60 * 60, 1 * 60 * 60 * 24, 1 * 60 * 60 * 24 * 7];
	    var timePairs = timeString.split(':');
	    for (var i = 0; i < timePairs.length; i++) {
	      totalSeconds += parseInt(timePairs[i], 10) * timeValues[timePairs.length - i - 1];
	    }
	    return totalSeconds;
	  }

	  /**
	   * Parse various time formats to seconds
	   * Supports: "1h30m20s", "1:30:20", plain seconds
	   * @param {string|number} [timeString] - Time in various formats
	   * @returns {number} Total time in seconds (0 if invalid)
	   */
	  util.getTime = function getTime(timeString) {
	    if (typeof timeString === 'undefined') {
	      return 0;
	    }
	    if (timeString.match(/^(\d+[smhdw]?)+$/)) {
	      return getLetterTime(timeString);
	    }
	    if (timeString.match(/^(\d+:?)+$/)) {
	      return getColonTime(timeString);
	    }
	    return 0;
	  };
	  return util;
	}

	var urlParser;
	var hasRequiredUrlParser;
	function requireUrlParser() {
	  if (hasRequiredUrlParser) return urlParser;
	  hasRequiredUrlParser = 1;
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

	  var _require$$ = requireUtil(),
	    getQueryParams = _require$$.getQueryParams;

	  /**
	   * URL Parser for extracting video information from various provider URLs
	   * @constructor
	   */
	  function UrlParser() {
	    for (var _i = 0, _arr = ['parseProvider', 'parse', 'bind', 'create']; _i < _arr.length; _i++) {
	      var key = _arr[_i];
	      this[key] = this[key].bind(this);
	    }
	    /** @type {Object<string, Provider>} Registered provider plugins */
	    this.plugins = {};
	  }
	  urlParser = UrlParser;

	  /**
	   * Extract provider name from URL
	   * @param {string} url - URL to parse
	   * @returns {string|undefined} Provider name or undefined if not found
	   */
	  UrlParser.prototype.parseProvider = function (url) {
	    var match = url.match(/(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(\w+)\./i);
	    return match ? match[1] : undefined;
	  };

	  /**
	   * Parse URL and extract video information
	   * @param {string} url - URL to parse
	   * @returns {VideoInfo|undefined} Parsed video information or undefined if not parseable
	   */
	  UrlParser.prototype.parse = function (url) {
	    if (typeof url === 'undefined') {
	      return undefined;
	    }
	    var provider = this.parseProvider(url);
	    var result;
	    var plugin = this.plugins[provider];
	    if (!provider || !plugin || !plugin.parse) {
	      return undefined;
	    }
	    result = plugin.parse.call(plugin, url, getQueryParams(url));
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
	  UrlParser.prototype.bind = function (plugin) {
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
	  UrlParser.prototype.create = function (op) {
	    if (_typeof(op) !== 'object' || _typeof(op.videoInfo) !== 'object') {
	      return undefined;
	    }
	    var vi = op.videoInfo;
	    var params = op.params;
	    var plugin = this.plugins[vi.provider];
	    params = params === 'internal' ? vi.params : params || {};
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
	  return urlParser;
	}

	/**
	 * URL Parser instance
	 * 
	 * Main entry point for parsing video URLs and reconstructing URLs from video info.
	 * 
	 * @type {UrlParser}
	 * 
	 * @example
	 * // Parse a YouTube URL
	 * const parser = require('js-video-url-parser');
	 * const videoInfo = parser.parse('https://www.youtube.com/watch?v=aqz-KE-bpKQ');
	 * // Returns: { id: 'aqz-KE-bpKQ', mediaType: 'video', provider: 'youtube' }
	 * 
	 * @example
	 * // Create a URL from video info
	 * const url = parser.create({
	 *   videoInfo: { id: 'aqz-KE-bpKQ', mediaType: 'video', provider: 'youtube' },
	 *   format: 'short'
	 * });
	 * // Returns: 'https://youtu.be/aqz-KE-bpKQ'
	 */
	var base;
	var hasRequiredBase;
	function requireBase() {
	  if (hasRequiredBase) return base;
	  hasRequiredBase = 1;
	  var UrlParser = requireUrlParser();
	  var parser = new UrlParser();
	  base = parser;
	  return base;
	}

	/**
	 * AlloCine provider plugin
	 * Supports parsing and URL generation for AlloCine movies and trailers
	 * @constructor
	 */
	var allocine;
	var hasRequiredAllocine;
	function requireAllocine() {
	  if (hasRequiredAllocine) return allocine;
	  hasRequiredAllocine = 1;
	  function Allocine() {
	    this.provider = 'allocine';
	    this.alternatives = [];
	    this.defaultFormat = 'embed';
	    this.formats = {
	      embed: this.createEmbedUrl
	    };
	    this.mediaTypes = {
	      VIDEO: 'video'
	    };
	  }
	  allocine = Allocine;
	  Allocine.prototype.parseUrl = function (url) {
	    var match = url.match(/(?:\/video\/player_gen_cmedia=)([A-Za-z0-9]+)/i);
	    return match ? match[1] : undefined;
	  };
	  Allocine.prototype.parse = function (url) {
	    var result = {
	      mediaType: this.mediaTypes.VIDEO,
	      id: this.parseUrl(url)
	    };
	    return result.id ? result : undefined;
	  };
	  Allocine.prototype.createEmbedUrl = function (vi) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    return 'https://player.allocine.fr/' + vi.id + '.html';
	  };
	  requireBase().bind(new Allocine());
	  return allocine;
	}

	/**
	 * CanalPlus provider plugin
	 * Supports parsing and URL generation for CanalPlus videos
	 * @constructor
	 */
	var canalplus;
	var hasRequiredCanalplus;
	function requireCanalplus() {
	  if (hasRequiredCanalplus) return canalplus;
	  hasRequiredCanalplus = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams;
	  function CanalPlus() {
	    this.provider = 'canalplus';
	    this.defaultFormat = 'embed';
	    this.formats = {
	      embed: this.createEmbedUrl
	    };
	    this.mediaTypes = {
	      VIDEO: 'video'
	    };
	  }
	  canalplus = CanalPlus;
	  CanalPlus.prototype.parseParameters = function (params) {
	    delete params.vid;
	    return params;
	  };
	  CanalPlus.prototype.parse = function (url, params) {
	    var _this = this;
	    var result = {
	      mediaType: this.mediaTypes.VIDEO,
	      id: params.vid
	    };
	    result.params = _this.parseParameters(params);
	    if (!result.id) {
	      return undefined;
	    }
	    return result;
	  };
	  CanalPlus.prototype.createEmbedUrl = function (vi, params) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    var url = 'http://player.canalplus.fr/embed/';
	    params.vid = vi.id;
	    url += combineParams(params);
	    return url;
	  };
	  requireBase().bind(new CanalPlus());
	  return canalplus;
	}

	/**
	 * Coub provider plugin
	 * Supports parsing and URL generation for Coub videos
	 * @constructor
	 */
	var coub;
	var hasRequiredCoub;
	function requireCoub() {
	  if (hasRequiredCoub) return coub;
	  hasRequiredCoub = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams;
	  function Coub() {
	    this.provider = 'coub';
	    this.defaultFormat = 'long';
	    this.formats = {
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl
	    };
	    this.mediaTypes = {
	      VIDEO: 'video'
	    };
	  }
	  coub = Coub;
	  Coub.prototype.parseUrl = function (url) {
	    var match = url.match(/(?:embed|view)\/([a-zA-Z\d]+)/i);
	    return match ? match[1] : undefined;
	  };
	  Coub.prototype.parse = function (url, params) {
	    var result = {
	      mediaType: this.mediaTypes.VIDEO,
	      params: params,
	      id: this.parseUrl(url)
	    };
	    if (!result.id) {
	      return undefined;
	    }
	    return result;
	  };
	  Coub.prototype.createUrl = function (baseUrl, vi, params) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    var url = baseUrl + vi.id;
	    url += combineParams(params);
	    return url;
	  };
	  Coub.prototype.createLongUrl = function (vi, params) {
	    return this.createUrl('https://coub.com/view/', vi, params);
	  };
	  Coub.prototype.createEmbedUrl = function (vi, params) {
	    return this.createUrl('//coub.com/embed/', vi, params);
	  };
	  requireBase().bind(new Coub());
	  return coub;
	}

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
	var dailymotion;
	var hasRequiredDailymotion;
	function requireDailymotion() {
	  if (hasRequiredDailymotion) return dailymotion;
	  hasRequiredDailymotion = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams,
	    getTime = _require$$.getTime;
	  function Dailymotion() {
	    /** @type {string} Provider identifier */
	    this.provider = 'dailymotion';

	    /** @type {string[]} Alternative domain names */
	    this.alternatives = ['dai'];

	    /** @type {string} Default URL format */
	    this.defaultFormat = 'long';

	    /** @type {Object<string, Function>} Available URL format handlers */
	    this.formats = {
	      "short": this.createShortUrl,
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl,
	      image: this.createImageUrl
	    };

	    /** @type {Object<string, string>} Media type constants */
	    this.mediaTypes = {
	      VIDEO: 'video'
	    };
	  }
	  dailymotion = Dailymotion;

	  /**
	   * Extract and normalize parameters from query string
	   * @param {Record<string, string>} params - Query parameters
	   * @returns {Record<string, string>} Normalized parameters
	   * @private
	   */
	  Dailymotion.prototype.parseParameters = function (params) {
	    return this.parseTime(params);
	  };

	  /**
	   * Parse time parameter to seconds
	   * @param {Record<string, string>} params - Query parameters
	   * @returns {Record<string, string>} Parameters with parsed time
	   * @private
	   */
	  Dailymotion.prototype.parseTime = function (params) {
	    if (params.start) {
	      params.start = getTime(params.start);
	    }
	    return params;
	  };
	  Dailymotion.prototype.parseUrl = function (url) {
	    var match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
	    return match ? match[1] : undefined;
	  };
	  Dailymotion.prototype.parse = function (url, params) {
	    var _this = this;
	    var result = {
	      mediaType: this.mediaTypes.VIDEO,
	      params: _this.parseParameters(params),
	      id: _this.parseUrl(url)
	    };
	    return result.id ? result : undefined;
	  };
	  Dailymotion.prototype.createUrl = function (base, vi, params) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    return base + vi.id + combineParams(params);
	  };
	  Dailymotion.prototype.createShortUrl = function (vi, params) {
	    return this.createUrl('https://dai.ly/', vi, params);
	  };
	  Dailymotion.prototype.createLongUrl = function (vi, params) {
	    return this.createUrl('https://dailymotion.com/video/', vi, params);
	  };
	  Dailymotion.prototype.createEmbedUrl = function (vi, params) {
	    return this.createUrl('https://www.dailymotion.com/embed/video/', vi, params);
	  };
	  Dailymotion.prototype.createImageUrl = function (vi, params) {
	    delete params.start;
	    return this.createUrl('https://www.dailymotion.com/thumbnail/video/', vi, params);
	  };
	  requireBase().bind(new Dailymotion());
	  return dailymotion;
	}

	/**
	 * Loom provider plugin
	 * Supports parsing and URL generation for Loom recordings
	 * @constructor
	 */
	var loom;
	var hasRequiredLoom;
	function requireLoom() {
	  if (hasRequiredLoom) return loom;
	  hasRequiredLoom = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams;
	  function Loom() {
	    this.provider = 'loom';
	    this.defaultFormat = 'long';
	    this.formats = {
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl
	    };
	    this.mediaTypes = {
	      VIDEO: 'video'
	    };
	  }
	  loom = Loom;
	  Loom.prototype.parseUrl = function (url) {
	    var match = url.match(/(?:share|embed)\/([a-zA-Z\d]+)/i);
	    return match ? match[1] : undefined;
	  };
	  Loom.prototype.parse = function (url, params) {
	    var result = {
	      mediaType: this.mediaTypes.VIDEO,
	      params: params,
	      id: this.parseUrl(url)
	    };
	    return result.id ? result : undefined;
	  };
	  Loom.prototype.createUrl = function (baseUrl, vi, params) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    var url = baseUrl + vi.id;
	    url += combineParams(params);
	    return url;
	  };
	  Loom.prototype.createLongUrl = function (vi, params) {
	    return this.createUrl('https://loom.com/share/', vi, params);
	  };
	  Loom.prototype.createEmbedUrl = function (vi, params) {
	    return this.createUrl('//loom.com/embed/', vi, params);
	  };
	  requireBase().bind(new Loom());
	  return loom;
	}

	/**
	 * Twitch provider plugin
	 * 
	 * Supports parsing and URL generation for:
	 * - Live streams: twitch.tv/CHANNEL
	 * - VODs (videos): twitch.tv/videos/ID or twitch.tv/CHANNEL/video/ID
	 * - Clips: twitch.tv/CHANNEL/clip/ID or clips.twitch.tv/ID
	 * 
	 * @constructor
	 * 
	 * @example
	 * // Live stream
	 * provider.parse('https://twitch.tv/monstercat')
	 * // Returns: { id: 'monstercat', mediaType: 'stream', provider: 'twitch' }
	 * 
	 * @example
	 * // Video with start time
	 * provider.parse('https://twitch.tv/videos/1234567890?t=1h30m')
	 * // Returns: { id: 'v1234567890', mediaType: 'video', params: { start: 5400 } }
	 */
	var twitch;
	var hasRequiredTwitch;
	function requireTwitch() {
	  if (hasRequiredTwitch) return twitch;
	  hasRequiredTwitch = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams,
	    getTime = _require$$.getTime;
	  function Twitch() {
	    /** @type {string} Provider identifier */
	    this.provider = 'twitch';

	    /** @type {string} Default URL format */
	    this.defaultFormat = 'long';

	    /** @type {Object<string, Function>} Available URL format handlers */
	    this.formats = {
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl
	    };

	    /** @type {Object<string, string>} Media type constants */
	    this.mediaTypes = {
	      VIDEO: 'video',
	      STREAM: 'stream',
	      CLIP: 'clip'
	    };
	  }
	  twitch = Twitch;

	  /**
	   * Separate media type prefix from ID
	   * @param {string} id - ID with prefix (v=video, c=clip, etc)
	   * @returns {Object} Object with {pre, id} - prefix and unprefixed ID
	   * @private
	   */
	  Twitch.prototype.seperateId = function (id) {
	    return {
	      pre: id[0],
	      id: id.substr(1)
	    };
	  };

	  /**
	   * Parse channel information from Twitch URL
	   * @param {Object} result - Parsing result accumulator
	   * @param {Record<string, string>} params - Query parameters
	   * @returns {Object} Result with channel set
	   * @private
	   */
	  Twitch.prototype.parseChannel = function (result, params) {
	    var channel = params.channel || params.utm_content || result.channel;
	    delete params.utm_content;
	    delete params.channel;
	    return channel;
	  };
	  Twitch.prototype.parseUrl = function (url, result, params) {
	    var match;
	    match = url.match(/(clips\.)?twitch\.tv\/(?:(?:videos\/(\d+))|(\w+(?:-[\w\d-]+)?)(?:\/clip\/(\w+))?)/i);
	    if (match && match[2]) {
	      //video
	      result.id = 'v' + match[2];
	    } else if (params.video) {
	      //video embed
	      result.id = params.video;
	      delete params.video;
	    } else if (params.clip) {
	      //clips embed
	      result.id = params.clip;
	      result.isClip = true;
	      delete params.clip;
	    } else if (match && match[1] && match[3]) {
	      //clips.twitch.tv/id
	      result.id = match[3];
	      result.isClip = true;
	    } else if (match && match[3] && match[4]) {
	      //twitch.tv/channel/clip/id
	      result.channel = match[3];
	      result.id = match[4];
	      result.isClip = true;
	    } else if (match && match[3]) {
	      result.channel = match[3];
	    }
	    return result;
	  };
	  Twitch.prototype.parseMediaType = function (result) {
	    var mediaType;
	    if (result.id) {
	      if (result.isClip) {
	        mediaType = this.mediaTypes.CLIP;
	        delete result.isClip;
	      } else {
	        mediaType = this.mediaTypes.VIDEO;
	      }
	    } else if (result.channel) {
	      mediaType = this.mediaTypes.STREAM;
	    }
	    return mediaType;
	  };
	  Twitch.prototype.parseParameters = function (params) {
	    if (params.t) {
	      params.start = getTime(params.t);
	      delete params.t;
	    }
	    return params;
	  };
	  Twitch.prototype.parse = function (url, params) {
	    var _this = this;
	    var result = {};
	    result = _this.parseUrl(url, result, params);
	    result.channel = _this.parseChannel(result, params);
	    result.mediaType = _this.parseMediaType(result);
	    result.params = _this.parseParameters(params);
	    return result.channel || result.id ? result : undefined;
	  };
	  Twitch.prototype.createLongUrl = function (vi, params) {
	    var url = '';
	    if (vi.mediaType === this.mediaTypes.STREAM && vi.channel) {
	      url = 'https://twitch.tv/' + vi.channel;
	    } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
	      var sep = this.seperateId(vi.id);
	      url = 'https://twitch.tv/videos/' + sep.id;
	      if (params.start) {
	        params.t = params.start + 's';
	        delete params.start;
	      }
	    } else if (vi.mediaType === this.mediaTypes.CLIP && vi.id) {
	      if (vi.channel) {
	        url = 'https://www.twitch.tv/' + vi.channel + '/clip/' + vi.id;
	      } else {
	        url = 'https://clips.twitch.tv/' + vi.id;
	      }
	    } else {
	      return undefined;
	    }
	    url += combineParams(params);
	    return url;
	  };
	  Twitch.prototype.createEmbedUrl = function (vi, params) {
	    var url = 'https://player.twitch.tv/';
	    if (vi.mediaType === this.mediaTypes.STREAM && vi.channel) {
	      params.channel = vi.channel;
	    } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
	      params.video = vi.id;
	      if (params.start) {
	        params.t = params.start + 's';
	        delete params.start;
	      }
	    } else if (vi.mediaType === this.mediaTypes.CLIP && vi.id) {
	      url = 'https://clips.twitch.tv/embed';
	      params.clip = vi.id;
	    } else {
	      return undefined;
	    }
	    url += combineParams(params);
	    return url;
	  };
	  requireBase().bind(new Twitch());
	  return twitch;
	}

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
	var vimeo;
	var hasRequiredVimeo;
	function requireVimeo() {
	  if (hasRequiredVimeo) return vimeo;
	  hasRequiredVimeo = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams,
	    getTime = _require$$.getTime;
	  function Vimeo() {
	    /** @type {string} Provider identifier */
	    this.provider = 'vimeo';

	    /** @type {string[]} Alternative domain names */
	    this.alternatives = ['vimeopro'];

	    /** @type {string} Default URL format */
	    this.defaultFormat = 'long';

	    /** @type {Object<string, Function>} Available URL format handlers */
	    this.formats = {
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl
	    };

	    /** @type {Object<string, string>} Media type constants */
	    this.mediaTypes = {
	      VIDEO: 'video'
	    };
	  }
	  vimeo = Vimeo;

	  /**
	   * Parse video ID from Vimeo URL
	   * @param {string} url - Vimeo URL
	   * @returns {string|undefined} Video ID or undefined
	   * @private
	   */
	  Vimeo.prototype.parseUrl = function (url) {
	    var match = url.match(/(?:\/showcase\/\d+)?(?:\/(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+)\/)?videos?))?\/(\d+)/i);
	    return match ? match[1] : undefined;
	  };

	  /**
	   * Parse hash token for private videos
	   * @param {string} url - Vimeo URL
	   * @returns {string|undefined} Hash token or undefined
	   * @private
	   */
	  Vimeo.prototype.parseHash = function (url) {
	    var match = url.match(/\/\d+\/(\w+)$/i);
	    return match ? match[1] : undefined;
	  };

	  /**
	   * Extract and normalize parameters from query string
	   * @param {Record<string, string>} params - Query parameters
	   * @returns {Record<string, string>} Normalized parameters
	   * @private
	   */
	  Vimeo.prototype.parseParameters = function (params) {
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
	  Vimeo.prototype.parse = function (url, params) {
	    var result = {
	      mediaType: this.mediaTypes.VIDEO,
	      params: this.parseParameters(params),
	      id: this.parseUrl(url)
	    };
	    var hash = this.parseHash(url, params);
	    if (hash) {
	      result.params.hash = hash;
	    }
	    return result.id ? result : undefined;
	  };
	  Vimeo.prototype.createUrl = function (baseUrl, vi, params, type) {
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
	  Vimeo.prototype.createLongUrl = function (vi, params) {
	    return this.createUrl('https://vimeo.com/', vi, params, 'long');
	  };
	  Vimeo.prototype.createEmbedUrl = function (vi, params) {
	    return this.createUrl('//player.vimeo.com/video/', vi, params, 'embed');
	  };
	  requireBase().bind(new Vimeo());
	  return vimeo;
	}

	/**
	 * Wistia provider plugin
	 * 
	 * Supports parsing and URL generation for:
	 * - Videos: wistia.com/medias/ID or home.wistia.com/medias/ID
	 * - With optional start times
	 * 
	 * @constructor
	 * 
	 * @example
	 * // Wistia video
	 * provider.parse('https://home.wistia.com/medias/abc123def')
	 * // Returns: { id: 'abc123def', mediaType: 'video', provider: 'wistia' }
	 */
	var wistia;
	var hasRequiredWistia;
	function requireWistia() {
	  if (hasRequiredWistia) return wistia;
	  hasRequiredWistia = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams,
	    getTime = _require$$.getTime;
	  function Wistia() {
	    /** @type {string} Provider identifier */
	    this.provider = 'wistia';

	    /** @type {string[]} Alternative domain names */
	    this.alternatives = [];

	    /** @type {string} Default URL format */
	    this.defaultFormat = 'long';

	    /** @type {Object<string, Function>} Available URL format handlers */
	    this.formats = {
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl,
	      embedjsonp: this.createEmbedJsonpUrl
	    };

	    /** @type {Object<string, string>} Media type constants */
	    this.mediaTypes = {
	      VIDEO: 'video',
	      EMBEDVIDEO: 'embedvideo'
	    };
	  }
	  wistia = Wistia;
	  Wistia.prototype.parseUrl = function (url) {
	    var match = url.match(/(?:(?:medias|iframe)\/|wvideo=)([\w-]+)/);
	    return match ? match[1] : undefined;
	  };
	  Wistia.prototype.parseChannel = function (url) {
	    var match = url.match(/(?:(?:https?:)?\/\/)?([^.]*)\.wistia\./);
	    var channel = match ? match[1] : undefined;
	    if (channel === 'fast' || channel === 'content') {
	      return undefined;
	    }
	    return channel;
	  };
	  Wistia.prototype.parseParameters = function (params, result) {
	    if (params.wtime) {
	      params.start = getTime(params.wtime);
	      delete params.wtime;
	    }
	    if (params.wvideo === result.id) {
	      delete params.wvideo;
	    }
	    return params;
	  };
	  Wistia.prototype.parseMediaType = function (result) {
	    if (result.id && result.channel) {
	      return this.mediaTypes.VIDEO;
	    } else if (result.id) {
	      delete result.channel;
	      return this.mediaTypes.EMBEDVIDEO;
	    } else {
	      return undefined;
	    }
	  };
	  Wistia.prototype.parse = function (url, params) {
	    var result = {
	      id: this.parseUrl(url),
	      channel: this.parseChannel(url)
	    };
	    result.params = this.parseParameters(params, result);
	    result.mediaType = this.parseMediaType(result);
	    if (!result.id) {
	      return undefined;
	    }
	    return result;
	  };
	  Wistia.prototype.createUrl = function (vi, params, url) {
	    if (params.start) {
	      params.wtime = params.start;
	      delete params.start;
	    }
	    url += combineParams(params);
	    return url;
	  };
	  Wistia.prototype.createLongUrl = function (vi, params) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    var url = 'https://' + vi.channel + '.wistia.com/medias/' + vi.id;
	    return this.createUrl(vi, params, url);
	  };
	  Wistia.prototype.createEmbedUrl = function (vi, params) {
	    if (!vi.id || !(vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.EMBEDVIDEO)) {
	      return undefined;
	    }
	    var url = 'https://fast.wistia.com/embed/iframe/' + vi.id;
	    return this.createUrl(vi, params, url);
	  };
	  Wistia.prototype.createEmbedJsonpUrl = function (vi) {
	    if (!vi.id || !(vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.EMBEDVIDEO)) {
	      return undefined;
	    }
	    return 'https://fast.wistia.com/embed/medias/' + vi.id + '.jsonp';
	  };
	  requireBase().bind(new Wistia());
	  return wistia;
	}

	/**
	 * Youku provider plugin
	 * Supports parsing and URL generation for Youku videos
	 * @constructor
	 */
	var youku;
	var hasRequiredYouku;
	function requireYouku() {
	  if (hasRequiredYouku) return youku;
	  hasRequiredYouku = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams;
	  function Youku() {
	    this.provider = 'youku';
	    this.defaultFormat = 'long';
	    this.formats = {
	      embed: this.createEmbedUrl,
	      "long": this.createLongUrl,
	      flash: this.createFlashUrl,
	      "static": this.createStaticUrl
	    };
	    this.mediaTypes = {
	      VIDEO: 'video'
	    };
	  }
	  youku = Youku;
	  Youku.prototype.parseUrl = function (url) {
	    var match = url.match(/(?:(?:embed|sid)\/|v_show\/id_|VideoIDS=)([a-zA-Z0-9]+)/);
	    return match ? match[1] : undefined;
	  };
	  Youku.prototype.parseParameters = function (params) {
	    if (params.VideoIDS) {
	      delete params.VideoIDS;
	    }
	    return params;
	  };
	  Youku.prototype.parse = function (url, params) {
	    var _this = this;
	    var result = {
	      mediaType: this.mediaTypes.VIDEO,
	      id: _this.parseUrl(url),
	      params: _this.parseParameters(params)
	    };
	    if (!result.id) {
	      return undefined;
	    }
	    return result;
	  };
	  Youku.prototype.createUrl = function (baseUrl, vi, params) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    var url = baseUrl + vi.id;
	    url += combineParams(params);
	    return url;
	  };
	  Youku.prototype.createEmbedUrl = function (vi, params) {
	    return this.createUrl('http://player.youku.com/embed/', vi, params);
	  };
	  Youku.prototype.createLongUrl = function (vi, params) {
	    return this.createUrl('http://v.youku.com/v_show/id_', vi, params);
	  };
	  Youku.prototype.createStaticUrl = function (vi, params) {
	    return this.createUrl('http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=', vi, params);
	  };
	  Youku.prototype.createFlashUrl = function (vi, params) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    var url = 'http://player.youku.com/player.php/sid/' + vi.id + '/v.swf';
	    url += combineParams(params);
	    return url;
	  };
	  requireBase().bind(new Youku());
	  return youku;
	}

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
	var youtube;
	var hasRequiredYoutube;
	function requireYoutube() {
	  if (hasRequiredYoutube) return youtube;
	  hasRequiredYoutube = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams,
	    getTime = _require$$.getTime;
	  function YouTube() {
	    /** @type {string} Provider identifier */
	    this.provider = 'youtube';

	    /** @type {string[]} Alternative domain names */
	    this.alternatives = ['youtu', 'ytimg'];

	    /** @type {string} Default URL format */
	    this.defaultFormat = 'long';

	    /** @type {Object<string, Function>} Available URL format handlers */
	    this.formats = {
	      "short": this.createShortUrl,
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl,
	      shortImage: this.createShortImageUrl,
	      longImage: this.createLongImageUrl
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
	      MAXRESDEFAULT: 'maxresdefault'
	    };

	    /** @type {string} Default image quality */
	    this.defaultImageQuality = this.imageQualities.HQDEFAULT;

	    /** @type {Object<string, string>} Media type constants */
	    this.mediaTypes = {
	      VIDEO: 'video',
	      PLAYLIST: 'playlist',
	      SHARE: 'share',
	      CHANNEL: 'channel'
	    };
	  }
	  youtube = YouTube;

	  /**
	   * Parse video ID from YouTube URL
	   * @param {string} url - YouTube URL
	   * @returns {string|undefined} 11-character video ID or undefined
	   * @private
	   */
	  YouTube.prototype.parseVideoUrl = function (url) {
	    var match = url.match(/(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)([\w-]{11})/i);
	    return match ? match[1] : undefined;
	  };

	  /**
	   * Parse channel information from YouTube URL
	   * @param {string} url - YouTube URL
	   * @returns {Object|undefined} Channel info with id/name and mediaType, or undefined
	   * @private
	   */
	  YouTube.prototype.parseChannelUrl = function (url) {
	    // Match an opaque channel ID
	    var match = url.match(/\/channel\/([\w-]+)/);
	    if (match) {
	      return {
	        id: match[1],
	        mediaType: this.mediaTypes.CHANNEL
	      };
	    }

	    // Match a vanity channel name or a user name. User urls are deprecated and
	    // currently redirect to the channel of that same name.
	    match = url.match(/\/(?:c|user)\/([\w-]+)/);
	    if (match) {
	      return {
	        name: match[1],
	        mediaType: this.mediaTypes.CHANNEL
	      };
	    }
	  };

	  /**
	   * Extract and normalize parameters from query string
	   * @param {Record<string, string>} params - Query parameters
	   * @param {Object} result - Parsing result accumulator
	   * @returns {Record<string, string>} Normalized parameters
	   * @private
	   */
	  YouTube.prototype.parseParameters = function (params, result) {
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
	  YouTube.prototype.parseMediaType = function (result) {
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
	  YouTube.prototype.parse = function (url, params) {
	    var channelResult = this.parseChannelUrl(url);
	    if (channelResult) {
	      return channelResult;
	    } else {
	      var result = {
	        params: params,
	        id: this.parseVideoUrl(url)
	      };
	      result.params = this.parseParameters(params, result);
	      result = this.parseMediaType(result);
	      return result;
	    }
	  };
	  YouTube.prototype.createShortUrl = function (vi, params) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    var url = 'https://youtu.be/' + vi.id;
	    if (params.start) {
	      url += '#t=' + params.start;
	    }
	    return url;
	  };
	  YouTube.prototype.createLongUrl = function (vi, params) {
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
	    } else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list) {
	      params.feature = 'share';
	      url += 'https://www.youtube.com/playlist';
	    } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
	      params.v = vi.id;
	      url += 'https://www.youtube.com/watch';
	    } else if (vi.mediaType === this.mediaTypes.SHARE && vi.id) {
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
	  YouTube.prototype.createEmbedUrl = function (vi, params) {
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
	  YouTube.prototype.createImageUrl = function (baseUrl, vi, params) {
	    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
	      return undefined;
	    }
	    var url = baseUrl + vi.id + '/';
	    var quality = params.imageQuality || this.defaultImageQuality;
	    return url + quality + '.jpg';
	  };
	  YouTube.prototype.createShortImageUrl = function (vi, params) {
	    return this.createImageUrl('https://i.ytimg.com/vi/', vi, params);
	  };
	  YouTube.prototype.createLongImageUrl = function (vi, params) {
	    return this.createImageUrl('https://img.youtube.com/vi/', vi, params);
	  };
	  requireBase().bind(new YouTube());
	  return youtube;
	}

	/**
	 * SoundCloud provider plugin
	 * 
	 * Supports parsing and URL generation for:
	 * - Tracks: soundcloud.com/USER/TRACK
	 * - Playlists: soundcloud.com/USER/sets/PLAYLIST
	 * - API tracks/playlists via oEmbed
	 * 
	 * @constructor
	 * 
	 * @example
	 * // Track
	 * provider.parse('https://soundcloud.com/artist/song-name')
	 * // Returns: { id: 'TRACK_ID', mediaType: 'track', provider: 'soundcloud' }
	 * 
	 * @example
	 * // Playlist
	 * provider.parse('https://soundcloud.com/artist/sets/collection-name')
	 * // Returns: { id: 'PLAYLIST_ID', mediaType: 'playlist', provider: 'soundcloud' }
	 */
	var soundcloud;
	var hasRequiredSoundcloud;
	function requireSoundcloud() {
	  if (hasRequiredSoundcloud) return soundcloud;
	  hasRequiredSoundcloud = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams,
	    getTime = _require$$.getTime;
	  function SoundCloud() {
	    /** @type {string} Provider identifier */
	    this.provider = 'soundcloud';

	    /** @type {string} Default URL format */
	    this.defaultFormat = 'long';

	    /** @type {Object<string, Function>} Available URL format handlers */
	    this.formats = {
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl
	    };

	    /** @type {Object<string, string>} Media type constants */
	    this.mediaTypes = {
	      TRACK: 'track',
	      PLAYLIST: 'playlist',
	      APITRACK: 'apitrack',
	      APIPLAYLIST: 'apiplaylist'
	    };
	  }
	  soundcloud = SoundCloud;
	  SoundCloud.prototype.parseUrl = function (url, result) {
	    var match = url.match(/(?:m\.)?soundcloud\.com\/(?:([\w-]+)\/(sets\/)?)([\w-]+)/i);
	    if (!match) {
	      return result;
	    }
	    result.channel = match[1];
	    if (match[1] === 'playlists' || match[2]) {
	      //playlist
	      result.list = match[3];
	    } else {
	      //track
	      result.id = match[3];
	    }
	    return result;
	  };
	  SoundCloud.prototype.parseParameters = function (params) {
	    if (params.t) {
	      params.start = getTime(params.t);
	      delete params.t;
	    }
	    return params;
	  };
	  SoundCloud.prototype.parseMediaType = function (result) {
	    if (result.id) {
	      if (result.channel === 'tracks') {
	        delete result.channel;
	        delete result.params.url;
	        result.mediaType = this.mediaTypes.APITRACK;
	      } else {
	        result.mediaType = this.mediaTypes.TRACK;
	      }
	    }
	    if (result.list) {
	      if (result.channel === 'playlists') {
	        delete result.channel;
	        delete result.params.url;
	        result.mediaType = this.mediaTypes.APIPLAYLIST;
	      } else {
	        result.mediaType = this.mediaTypes.PLAYLIST;
	      }
	    }
	    return result;
	  };
	  SoundCloud.prototype.parse = function (url, params) {
	    var result = {};
	    result = this.parseUrl(url, result);
	    result.params = this.parseParameters(params);
	    result = this.parseMediaType(result);
	    if (!result.id && !result.list) {
	      return undefined;
	    }
	    return result;
	  };
	  SoundCloud.prototype.createLongUrl = function (vi, params) {
	    var url = '';
	    var startTime = params.start;
	    delete params.start;
	    if (vi.mediaType === this.mediaTypes.TRACK && vi.id && vi.channel) {
	      url = 'https://soundcloud.com/' + vi.channel + '/' + vi.id;
	    } else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list && vi.channel) {
	      url = 'https://soundcloud.com/' + vi.channel + '/sets/' + vi.list;
	    } else if (vi.mediaType === this.mediaTypes.APITRACK && vi.id) {
	      url = 'https://api.soundcloud.com/tracks/' + vi.id;
	    } else if (vi.mediaType === this.mediaTypes.APIPLAYLIST && vi.list) {
	      url = 'https://api.soundcloud.com/playlists/' + vi.list;
	    } else {
	      return undefined;
	    }
	    url += combineParams(params);
	    if (startTime) {
	      url += '#t=' + startTime;
	    }
	    return url;
	  };
	  SoundCloud.prototype.createEmbedUrl = function (vi, params) {
	    var url = 'https://w.soundcloud.com/player/';
	    delete params.start;
	    if (vi.mediaType === this.mediaTypes.APITRACK && vi.id) {
	      params.url = 'https%3A//api.soundcloud.com/tracks/' + vi.id;
	    } else if (vi.mediaType === this.mediaTypes.APIPLAYLIST && vi.list) {
	      params.url = 'https%3A//api.soundcloud.com/playlists/' + vi.list;
	    } else {
	      return undefined;
	    }
	    url += combineParams(params);
	    return url;
	  };
	  requireBase().bind(new SoundCloud());
	  return soundcloud;
	}

	/**
	 * TeacherTube provider plugin
	 * 
	 * Supports parsing and URL generation for:
	 * - Videos: teachertube.com/video/ID
	 * - Audio, documents, channels, collections, and groups
	 * 
	 * @constructor
	 */
	var teachertube;
	var hasRequiredTeachertube;
	function requireTeachertube() {
	  if (hasRequiredTeachertube) return teachertube;
	  hasRequiredTeachertube = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams;
	  function TeacherTube() {
	    /** @type {string} Provider identifier */
	    this.provider = 'teachertube';

	    /** @type {string[]} Alternative domain names */
	    this.alternatives = [];

	    /** @type {string} Default URL format */
	    this.defaultFormat = 'long';

	    /** @type {Object<string, Function>} Available URL format handlers */
	    this.formats = {
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl
	    };

	    /** @type {Object<string, string>} Media type constants */
	    this.mediaTypes = {
	      VIDEO: 'video',
	      AUDIO: 'audio',
	      DOCUMENT: 'document',
	      CHANNEL: 'channel',
	      COLLECTION: 'collection',
	      GROUP: 'group'
	    };
	  }
	  teachertube = TeacherTube;
	  TeacherTube.prototype.parse = function (url, params) {
	    var result = {};
	    result.list = this.parsePlaylist(params);
	    result.params = params;
	    var match = url.match(/\/(audio|video|document|user\/channel|collection|group)\/(?:[\w-]+-)?(\w+)/);
	    if (!match) {
	      return undefined;
	    }
	    result.mediaType = this.parseMediaType(match[1]);
	    result.id = match[2];
	    return result;
	  };
	  TeacherTube.prototype.parsePlaylist = function (params) {
	    if (params['playlist-id']) {
	      var list = params['playlist-id'];
	      delete params['playlist-id'];
	      return list;
	    }
	    return undefined;
	  };
	  TeacherTube.prototype.parseMediaType = function (mediaTypeMatch) {
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
	  TeacherTube.prototype.createLongUrl = function (vi, params) {
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
	  TeacherTube.prototype.createEmbedUrl = function (vi, params) {
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
	  requireBase().bind(new TeacherTube());
	  return teachertube;
	}

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
	var tiktok;
	var hasRequiredTiktok;
	function requireTiktok() {
	  if (hasRequiredTiktok) return tiktok;
	  hasRequiredTiktok = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams;
	  function TikTok() {
	    /** @type {string} Provider identifier */
	    this.provider = 'tiktok';

	    /** @type {string} Default URL format */
	    this.defaultFormat = 'long';

	    /** @type {Object<string, Function>} Available URL format handlers */
	    this.formats = {
	      "long": this.createLongUrl
	    };

	    /** @type {Object<string, string>} Media type constants */
	    this.mediaTypes = {
	      VIDEO: 'video'
	    };
	  }
	  tiktok = TikTok;

	  /**
	   * Parse TikTok URL to extract video information
	   * @param {string} url - TikTok URL
	   * @param {Record<string, string>} params - Query parameters
	   * @returns {Object|undefined} Video information (id, mediaType, params) or undefined
	   */
	  TikTok.prototype.parse = function (url, params) {
	    var result = {
	      params: params,
	      mediaType: this.mediaTypes.VIDEO
	    };
	    var match = url.match(/@([^/]+)\/video\/(\d{19})/);
	    if (!match) {
	      return;
	    }
	    result.channel = match[1];
	    result.id = match[2];
	    return result;
	  };
	  TikTok.prototype.createLongUrl = function (vi, params) {
	    var url = '';
	    if (vi.mediaType === this.mediaTypes.VIDEO && vi.id && vi.channel) {
	      url += "https://www.tiktok.com/@".concat(vi.channel, "/video/").concat(vi.id);
	    } else {
	      return undefined;
	    }
	    url += combineParams(params);
	    return url;
	  };
	  requireBase().bind(new TikTok());
	  return tiktok;
	}

	/**
	 * TED provider plugin
	 * Supports parsing and URL generation for TED talks and playlists
	 * @constructor
	 */
	var ted;
	var hasRequiredTed;
	function requireTed() {
	  if (hasRequiredTed) return ted;
	  hasRequiredTed = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams;
	  function Ted() {
	    this.provider = 'ted';
	    this.formats = {
	      "long": this.createLongUrl,
	      embed: this.createEmbedUrl
	    };
	    this.mediaTypes = {
	      VIDEO: 'video',
	      PLAYLIST: 'playlist'
	    };
	  }
	  ted = Ted;
	  Ted.prototype.parseUrl = function (url, result) {
	    var match = url.match(/\/(talks|playlists\/(\d+))\/([\w-]+)/i);
	    var channel = match ? match[1] : undefined;
	    if (!channel) {
	      return result;
	    }
	    result.channel = channel.split('/')[0];
	    result.id = match[3];
	    if (result.channel === 'playlists') {
	      result.list = match[2];
	    }
	    return result;
	  };
	  Ted.prototype.parseMediaType = function (result) {
	    if (result.id && result.channel === 'playlists') {
	      delete result.channel;
	      result.mediaType = this.mediaTypes.PLAYLIST;
	    }
	    if (result.id && result.channel === 'talks') {
	      delete result.channel;
	      result.mediaType = this.mediaTypes.VIDEO;
	    }
	    return result;
	  };
	  Ted.prototype.parse = function (url, params) {
	    var result = {
	      params: params
	    };
	    result = this.parseUrl(url, result);
	    result = this.parseMediaType(result);
	    if (!result.id) {
	      return undefined;
	    }
	    return result;
	  };
	  Ted.prototype.createLongUrl = function (vi, params) {
	    var url = '';
	    if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
	      url += 'https://ted.com/talks/' + vi.id;
	    } else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.id) {
	      url += 'https://ted.com/playlists/' + vi.list + '/' + vi.id;
	    } else {
	      return undefined;
	    }
	    url += combineParams(params);
	    return url;
	  };
	  Ted.prototype.createEmbedUrl = function (vi, params) {
	    var url = 'https://embed.ted.com/';
	    if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.id) {
	      url += 'playlists/' + vi.list + '/' + vi.id;
	    } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
	      url += 'talks/' + vi.id;
	    } else {
	      return undefined;
	    }
	    url += combineParams(params);
	    return url;
	  };
	  requireBase().bind(new Ted());
	  return ted;
	}

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
	var facebook;
	var hasRequiredFacebook;
	function requireFacebook() {
	  if (hasRequiredFacebook) return facebook;
	  hasRequiredFacebook = 1;
	  var _require$$ = requireUtil(),
	    combineParams = _require$$.combineParams;
	  function Facebook() {
	    /** @type {string} Provider identifier */
	    this.provider = 'facebook';

	    /** @type {string[]} Alternative domain names */
	    this.alternatives = [];

	    /** @type {string} Default URL format */
	    this.defaultFormat = 'long';

	    /** @type {Object<string, Function>} Available URL format handlers */
	    this.formats = {
	      "long": this.createLongUrl,
	      watch: this.createWatchUrl
	    };

	    /** @type {Object<string, string>} Media type constants */
	    this.mediaTypes = {
	      VIDEO: 'video'
	    };
	  }
	  facebook = Facebook;

	  /**
	   * Parse Facebook URL to extract video information
	   * @param {string} url - Facebook URL
	   * @param {Record<string, string>} params - Query parameters
	   * @returns {Object|undefined} Video information (id, mediaType, params) or undefined
	   */
	  Facebook.prototype.parse = function (url, params) {
	    var result = {
	      params: params,
	      mediaType: this.mediaTypes.VIDEO
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
	  Facebook.prototype.createWatchUrl = function (vi, params) {
	    var url = 'https://facebook.com/watch/';
	    if (vi.mediaType !== this.mediaTypes.VIDEO || !vi.id) {
	      return undefined;
	    }
	    params = {
	      v: vi.id
	    };
	    url += combineParams(params);
	    return url;
	  };
	  Facebook.prototype.createLongUrl = function (vi, params) {
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
	  requireBase().bind(new Facebook());
	  return facebook;
	}

	/**
	 * js-video-url-parser
	 * 
	 * A parser to extract provider, video ID, media type, and other metadata 
	 * from video URLs (YouTube, Vimeo, Dailymotion, Twitch, SoundCloud, TikTok, etc.)
	 * and reconstruct URLs in various formats.
	 * 
	 * @type {UrlParser}
	 * 
	 * @example
	 * // Parse a Vimeo URL
	 * const parser = require('js-video-url-parser');
	 * const info = parser.parse('https://vimeo.com/96063277');
	 * // Returns: { id: '96063277', mediaType: 'video', provider: 'vimeo' }
	 * 
	 * @example
	 * // Create a short URL from parsed info
	 * const shortUrl = parser.create({
	 *   videoInfo: { id: '96063277', mediaType: 'video', provider: 'vimeo' },
	 *   format: 'short'
	 * });
	 * 
	 * @example
	 * // ESM usage: import parser from 'js-video-url-parser/esm';
	 */
	var lib;
	var hasRequiredLib;
	function requireLib() {
	  if (hasRequiredLib) return lib;
	  hasRequiredLib = 1;
	  var parser = requireBase();
	  requireAllocine();
	  requireCanalplus();
	  requireCoub();
	  requireDailymotion();
	  requireLoom();
	  requireTwitch();
	  requireVimeo();
	  requireWistia();
	  requireYouku();
	  requireYoutube();
	  requireSoundcloud();
	  requireTeachertube();
	  requireTiktok();
	  requireTed();
	  requireFacebook();
	  lib = parser;
	  return lib;
	}

	var libExports = requireLib();
	var index = /*@__PURE__*/getDefaultExportFromCjs(libExports);

	return index;

}));
