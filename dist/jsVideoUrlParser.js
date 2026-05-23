(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.urlParser = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function _arrayLikeToArray(r, a) {
	  (null == a || a > r.length) && (a = r.length);
	  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	  return n;
	}
	function _arrayWithHoles(r) {
	  if (Array.isArray(r)) return r;
	}
	function _createForOfIteratorHelper(r, e) {
	  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	  if (!t) {
	    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
	      t && (r = t);
	      var n = 0,
	        F = function () {};
	      return {
	        s: F,
	        n: function () {
	          return n >= r.length ? {
	            done: true
	          } : {
	            done: false,
	            value: r[n++]
	          };
	        },
	        e: function (r) {
	          throw r;
	        },
	        f: F
	      };
	    }
	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }
	  var o,
	    a = true,
	    u = false;
	  return {
	    s: function () {
	      t = t.call(r);
	    },
	    n: function () {
	      var r = t.next();
	      return a = r.done, r;
	    },
	    e: function (r) {
	      u = true, o = r;
	    },
	    f: function () {
	      try {
	        a || null == t.return || t.return();
	      } finally {
	        if (u) throw o;
	      }
	    }
	  };
	}
	function _iterableToArrayLimit(r, l) {
	  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	  if (null != t) {
	    var e,
	      n,
	      i,
	      u,
	      a = [],
	      f = true,
	      o = false;
	    try {
	      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
	    } catch (r) {
	      o = true, n = r;
	    } finally {
	      try {
	        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
	      } finally {
	        if (o) throw n;
	      }
	    }
	    return a;
	  }
	}
	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _slicedToArray(r, e) {
	  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _typeof(o) {
	  "@babel/helpers - typeof";

	  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
	    return typeof o;
	  } : function (o) {
	    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	  }, _typeof(o);
	}
	function _unsupportedIterableToArray(r, a) {
	  if (r) {
	    if ("string" == typeof r) return _arrayLikeToArray(r, a);
	    var t = {}.toString.call(r).slice(8, -1);
	    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	  }
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

	function commonjsRequire(path) {
		throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
	}

	/**
	 * Provider Registry
	 * 
	 * Central registry for all video provider plugins. Allows:
	 * - Decoupled provider registration
	 * - Lazy or eager loading of providers
	 * - Cleaner ESM module structure
	 * - Better control over side effects
	 * 
	 * @module provider/registry
	 */
	var registry;
	var hasRequiredRegistry;
	function requireRegistry() {
	  if (hasRequiredRegistry) return registry;
	  hasRequiredRegistry = 1;
	  /**
	   * Global registry of providers
	   * @type {Map<string, Function>}
	   * @private
	   */
	  var providers = new Map();

	  /**
	   * Register a provider plugin with the parser
	   * 
	   * @param {Function} ProviderConstructor - Provider class/constructor
	   * @returns {Function} The provider constructor (for chaining)
	   * 
	   * @example
	   * // In provider module (e.g., youtube.js):
	   * module.exports = registerProvider(YouTube);
	   * 
	   * @example
	   * // In parser initialization:
	   * parser.bind(new YouTube());
	   */
	  function registerProvider(ProviderConstructor) {
	    if (typeof ProviderConstructor !== 'function') {
	      throw new TypeError('Provider must be a constructor function');
	    }

	    // Create an instance to get provider name and alternatives
	    var instance = new ProviderConstructor();
	    if (!instance.provider) {
	      throw new Error("Provider missing 'provider' property: ".concat(ProviderConstructor.name));
	    }
	    providers.set(instance.provider, ProviderConstructor);
	    return ProviderConstructor;
	  }

	  /**
	   * Get all registered provider constructors
	   * 
	   * @returns {Map<string, Function>} Map of provider names to constructors
	   * 
	   * @example
	   * const allProviders = getAllProviders();
	   * for (const [name, Constructor] of allProviders) {
	   *   console.log(`Provider: ${name}`);
	   * }
	   */
	  function getAllProviders() {
	    return new Map(providers);
	  }

	  /**
	   * Get a specific provider constructor by name
	   * 
	   * @param {string} name - Provider name (e.g., 'youtube', 'vimeo')
	   * @returns {Function|undefined} Provider constructor or undefined
	   * 
	   * @example
	   * const YouTubeProvider = getProvider('youtube');
	   * if (YouTubeProvider) {
	   *   parser.bind(new YouTubeProvider());
	   * }
	   */
	  function getProvider(name) {
	    return providers.get(name);
	  }

	  /**
	   * Clear all registered providers (useful for testing)
	   * 
	   * @returns {void}
	   */
	  function clearProviders() {
	    providers.clear();
	  }

	  /**
	   * Get count of registered providers
	   * 
	   * @returns {number} Number of registered providers
	   */
	  function getProviderCount() {
	    return providers.size;
	  }
	  registry = {
	    registerProvider: registerProvider,
	    getAllProviders: getAllProviders,
	    getProvider: getProvider,
	    clearProviders: clearProviders,
	    getProviderCount: getProviderCount
	  };
	  return registry;
	}

	var loader;
	var hasRequiredLoader;
	function requireLoader() {
	  if (hasRequiredLoader) return loader;
	  hasRequiredLoader = 1;
	  var _require$$ = requireRegistry(),
	    getAllProviders = _require$$.getAllProviders;

	  /**
	   * Available provider modules
	   * @type {Array<string>}
	   * @private
	   */
	  var PROVIDER_MODULES = ['./allocine', './canalplus', './coub', './dailymotion', './facebook', './loom', './soundcloud', './teachertube', './ted', './tiktok', './twitch', './vimeo', './wistia', './youku', './youtube'];

	  /**
	   * Load and bind all built-in providers to the given parser
	   * 
	   * This function requires all provider modules and binds them to the parser.
	   * Providers auto-register when required, so we just need to instantiate
	   * and bind them.
	   * 
	   * @param {UrlParser} parser - Parser instance to bind providers to
	   * @returns {UrlParser} The parser instance (for chaining)
	   * 
	   * @example
	   * const parser = new UrlParser();
	   * loadProviders(parser);
	   * parser.parse('https://youtube.com/watch?v=aqz-KE-bpKQ');
	   */
	  function loadProviders(parser) {
	    if (!parser || typeof parser.bind !== 'function') {
	      throw new TypeError('Parser must have a bind() method');
	    }

	    // Require all provider modules (they auto-register)
	    PROVIDER_MODULES.forEach(function (modulePath) {
	      commonjsRequire(modulePath);
	    });

	    // Get all registered providers and bind them
	    var providers = getAllProviders();
	    var _iterator = _createForOfIteratorHelper(providers),
	      _step;
	    try {
	      for (_iterator.s(); !(_step = _iterator.n()).done;) {
	        var _step$value = _slicedToArray(_step.value, 2),
	          name = _step$value[0],
	          ProviderConstructor = _step$value[1];
	        var instance = new ProviderConstructor();
	        parser.bind(instance);
	      }
	    } catch (err) {
	      _iterator.e(err);
	    } finally {
	      _iterator.f();
	    }
	    return parser;
	  }

	  /**
	   * Load only specific providers by name
	   * 
	   * Useful when you only need a subset of providers to reduce bundle size
	   * in ESM contexts.
	   * 
	   * @param {UrlParser} parser - Parser instance to bind providers to
	   * @param {string[]} providerNames - Provider names to load (e.g., ['youtube', 'vimeo'])
	   * @returns {UrlParser} The parser instance (for chaining)
	   * 
	   * @example
	   * const parser = new UrlParser();
	   * loadSpecificProviders(parser, ['youtube', 'vimeo']);
	   * // Only YouTube and Vimeo providers are available
	   */
	  function loadSpecificProviders(parser, providerNames) {
	    if (!parser || typeof parser.bind !== 'function') {
	      throw new TypeError('Parser must have a bind() method');
	    }
	    if (!Array.isArray(providerNames)) {
	      throw new TypeError('providerNames must be an array');
	    }
	    var providerMap = {
	      allocine: './allocine',
	      canalplus: './canalplus',
	      coub: './coub',
	      dailymotion: './dailymotion',
	      facebook: './facebook',
	      loom: './loom',
	      soundcloud: './soundcloud',
	      teachertube: './teachertube',
	      ted: './ted',
	      tiktok: './tiktok',
	      twitch: './twitch',
	      vimeo: './vimeo',
	      wistia: './wistia',
	      youku: './youku',
	      youtube: './youtube'
	    };

	    // Load requested providers
	    var _iterator2 = _createForOfIteratorHelper(providerNames),
	      _step2;
	    try {
	      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	        var name = _step2.value;
	        var modulePath = providerMap[name];
	        if (!modulePath) {
	          throw new Error("Unknown provider: ".concat(name));
	        }
	        commonjsRequire(modulePath);
	      }

	      // Bind all registered providers
	    } catch (err) {
	      _iterator2.e(err);
	    } finally {
	      _iterator2.f();
	    }
	    var providers = getAllProviders();
	    var _iterator3 = _createForOfIteratorHelper(providers),
	      _step3;
	    try {
	      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	        var _step3$value = _slicedToArray(_step3.value, 2),
	          _name = _step3$value[0],
	          ProviderConstructor = _step3$value[1];
	        var instance = new ProviderConstructor();
	        parser.bind(instance);
	      }
	    } catch (err) {
	      _iterator3.e(err);
	    } finally {
	      _iterator3.f();
	    }
	    return parser;
	  }
	  loader = {
	    loadProviders: loadProviders,
	    loadSpecificProviders: loadSpecificProviders
	  };
	  return loader;
	}

	/**
	 * URL Parser instance
	 * 
	 * Main entry point for parsing video URLs and reconstructing URLs from video info.
	 * Providers are automatically loaded and registered on initialization.
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
	  var _require$$ = requireLoader(),
	    loadProviders = _require$$.loadProviders;
	  var parser = new UrlParser();
	  loadProviders(parser);
	  base = parser;
	  return base;
	}

	/**
	 * js-video-url-parser
	 * 
	 * A parser to extract provider, video ID, media type, and other metadata 
	 * from video URLs (YouTube, Vimeo, Dailymotion, Twitch, SoundCloud, TikTok, etc.)
	 * and reconstruct URLs in various formats.
	 * 
	 * Providers are automatically loaded and registered when the module is required.
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
	  lib = requireBase();
	  return lib;
	}

	var libExports = requireLib();
	var index = /*@__PURE__*/getDefaultExportFromCjs(libExports);

	return index;

}));
