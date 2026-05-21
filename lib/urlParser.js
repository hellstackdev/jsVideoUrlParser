const {
  getQueryParams,
} = require('./util');

class UrlParser {
  constructor() {
    for (const key of [
      'parseProvider',
      'parse',
      'bind',
      'create',
    ]) {
      this[key] = this[key].bind(this);
    }
    this.plugins = {};
  }

  parseProvider(url) {
    const match = url.match(
      /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(\w+)\./i,
    );
    return match ? match[1] : undefined;
  }

  parse(url) {
    if (typeof url === 'undefined') {
      return undefined;
    }
    const provider = this.parseProvider(url);
    let result;
    const plugin = this.plugins[provider];
    if (!provider || !plugin || !plugin.parse) {
      return undefined;
    }
    result = plugin.parse.call(
      plugin,
      url,
      getQueryParams(url),
    );
    if (result) {
      result = removeEmptyParameters(result);
      result.provider = plugin.provider;
    }
    return result;
  }

  bind(plugin) {
    this.plugins[plugin.provider] = plugin;
    if (plugin.alternatives) {
      for (let i = 0; i < plugin.alternatives.length; i += 1) {
        this.plugins[plugin.alternatives[i]] = plugin;
      }
    }
  }

  create(op) {
    if (typeof op !== 'object' || typeof op.videoInfo !== 'object') {
      return undefined;
    }

    const vi = op.videoInfo;
    let params = op.params;
    const plugin = this.plugins[vi.provider];

    params = params === 'internal' ? vi.params : params || {};

    if (plugin) {
      op.format = op.format || plugin.defaultFormat;
      // eslint-disable-next-line no-prototype-builtins
      if (plugin.formats.hasOwnProperty(op.format)) {
        return plugin.formats[op.format].apply(plugin, [vi, Object.assign({}, params)]);
      }
    }
    return undefined;
  }
}

module.exports = UrlParser;

function removeEmptyParameters(result) {
  if (result.params && Object.keys(result.params).length === 0) {
    delete result.params;
  }
  return result;
}
