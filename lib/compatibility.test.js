const parser = require('./index');
const UrlParser = require('./urlParser');
const { combineParams } = require('./util');

test('compat: parseProvider host matching behavior remains stable', () => {
  const localParser = new UrlParser();
  expect(
    localParser.parseProvider('https://www.youtube.com/watch?v=HRb7B9fPhfA'),
  ).toBe('youtube');
  expect(localParser.parseProvider('//m.vimeo.com/123456')).toBe('vimeo');
  expect(localParser.parseProvider('http://player.twitch.tv/?video=v123')).toBe(
    'twitch',
  );
});

test('compat: param normalization ordering remains deterministic', () => {
  expect(combineParams({ z: '1', a: '2', m: '3' })).toBe('?a=2&m=3&z=1');
  expect(combineParams({ z: '1', a: '2', m: '3' }, true)).toBe('&a=2&m=3&z=1');
});

test('compat: parse removes empty params object from result', () => {
  const result = parser.parse('https://www.youtube.com/watch?v=HRb7B9fPhfA');
  expect(result).toEqual({
    provider: 'youtube',
    id: 'HRb7B9fPhfA',
    mediaType: 'video',
  });
});

test('compat: provider deep import paths remain require-able', () => {
  expect(() => {
    require('./provider/youtube');
    require('./provider/vimeo');
    require('./provider/tiktok');
  }).not.toThrow();
});

test('compat: roundtrip representative provider URLs', () => {
  const vectors = [
    {
      url: 'https://www.youtube.com/watch?v=HRb7B9fPhfA&t=30s',
      expectProvider: 'youtube',
      format: 'long',
    },
    {
      url: 'https://vimeo.com/97276391',
      expectProvider: 'vimeo',
      format: 'long',
    },
    {
      url: 'https://www.tiktok.com/@scout2015/video/6718335390845095173',
      expectProvider: 'tiktok',
      format: 'long',
    },
    {
      url: 'https://www.facebook.com/watch/?v=10101010101010101',
      expectProvider: 'facebook',
      format: 'watch',
    },
    {
      url: 'https://loom.com/share/9206412c4aba41bcabd05b4d100911ba',
      expectProvider: 'loom',
      format: 'long',
    },
  ];

  vectors.forEach(vector => {
    const parsed = parser.parse(vector.url);
    expect(parsed).toBeDefined();
    expect(parsed.provider).toBe(vector.expectProvider);
    expect(parser.create({
      videoInfo: parsed,
      format: vector.format,
    })).toBeDefined();
  });
});
