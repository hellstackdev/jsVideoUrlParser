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
const UrlParser = require('./urlParser');
const { loadProviders } = require('./provider/loader');

const parser = new UrlParser();
loadProviders(parser);

module.exports = parser;
