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
const parser = require('./base');
require('./provider/allocine');
require('./provider/canalplus');
require('./provider/coub');
require('./provider/dailymotion');
require('./provider/loom');
require('./provider/twitch');
require('./provider/vimeo');
require('./provider/wistia');
require('./provider/youku');
require('./provider/youtube');
require('./provider/soundcloud');
require('./provider/teachertube');
require('./provider/tiktok');
require('./provider/ted');
require('./provider/facebook');
module.exports = parser;
