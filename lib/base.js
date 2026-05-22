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
const UrlParser = require('./urlParser');
const parser = new UrlParser();
module.exports = parser;
