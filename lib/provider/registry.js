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

/**
 * Global registry of providers
 * @type {Map<string, Function>}
 * @private
 */
const providers = new Map();

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
  const instance = new ProviderConstructor();
  if (!instance.provider) {
    throw new Error(`Provider missing 'provider' property: ${ProviderConstructor.name}`);
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

module.exports = {
  registerProvider,
  getAllProviders,
  getProvider,
  clearProviders,
  getProviderCount,
};
