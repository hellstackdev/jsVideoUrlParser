/**
 * Provider Loader
 * 
 * Loads and registers all built-in providers with the given parser.
 * This module centralizes provider loading, making it easier to manage
 * which providers are available and when they're loaded.
 * 
 * @module provider/loader
 */

const { getAllProviders } = require('./registry');

/**
 * Available provider modules
 * @type {Array<string>}
 * @private
 */
const PROVIDER_MODULES = [
  './allocine',
  './canalplus',
  './coub',
  './dailymotion',
  './facebook',
  './loom',
  './soundcloud',
  './teachertube',
  './ted',
  './tiktok',
  './twitch',
  './vimeo',
  './wistia',
  './youku',
  './youtube',
];

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
  PROVIDER_MODULES.forEach((modulePath) => {
    require(modulePath);
  });

  // Get all registered providers and bind them
  const providers = getAllProviders();
  for (const [name, ProviderConstructor] of providers) {
    const instance = new ProviderConstructor();
    parser.bind(instance);
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

  const providerMap = {
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
    youtube: './youtube',
  };

  // Load requested providers
  for (const name of providerNames) {
    const modulePath = providerMap[name];
    if (!modulePath) {
      throw new Error(`Unknown provider: ${name}`);
    }
    require(modulePath);
  }

  // Bind all registered providers
  const providers = getAllProviders();
  for (const [name, ProviderConstructor] of providers) {
    const instance = new ProviderConstructor();
    parser.bind(instance);
  }

  return parser;
}

module.exports = {
  loadProviders,
  loadSpecificProviders,
};
