/**
 * Parse query parameters from a query string
 * @param {string} [qs] - Query string (with or without leading ? or #)
 * @returns {Record<string, string>} Parsed query parameters
 */
exports.getQueryParams = function getQueryParams(qs) {
  if (typeof qs !== 'string') {
    return {};
  }
  qs = qs.split('+').join(' ');

  var params = {};
  var match = qs.match(
    /(?:[?](?:[^=]+)=(?:[^&#]*)(?:[&](?:[^=]+)=(?:[^&#]*))*(?:[#].*)?)|(?:[#].*)/
  );
  var split;

  if (match === null) {
    return {};
  }

  split = match[0].substr(1).split(/[&#=]/);

  for (var i = 0; i < split.length; i += 2) {
    params[decodeURIComponent(split[i])] =
      decodeURIComponent(split[i + 1] || '');
  }

  return params;
};

/**
 * Combine parameters into a URL query string
 * @param {Record<string, string>} params - Parameters to combine
 * @param {boolean} [hasParams] - Whether URL already has parameters
 * @returns {string} Combined query string (e.g., '?key=value&key2=value2')
 */
exports.combineParams = function combineParams(params, hasParams) {
  if (typeof params !== 'object') {
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
    'w': 1 * 60 * 60 * 24 * 7,
  };
  var timePairs;

  //expand to "1 h 30 m 20 s" and split
  timeString = timeString.replace(/([smhdw])/g, ' $1 ').trim();
  timePairs = timeString.split(' ');

  for (var i = 0; i < timePairs.length; i += 2) {
    totalSeconds += parseInt(timePairs[i], 10) *
      timeValues[timePairs[i + 1] || 's'];
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
  var timeValues = [
    1,
    1 * 60,
    1 * 60 * 60,
    1 * 60 * 60 * 24,
    1 * 60 * 60 * 24 * 7,
  ];
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
exports.getTime = function getTime(timeString) {
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