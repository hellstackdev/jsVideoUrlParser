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
module.exports = require('./base');
