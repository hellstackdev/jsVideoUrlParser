const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

test('ESM adapter exposes the shared parser instance', () => {
  const moduleUrl = pathToFileURL(require.resolve('./index.mjs')).href;
  const output = execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `const { default: parser } = await import(${JSON.stringify(moduleUrl)});
       console.log(JSON.stringify(parser.parse('http://www.youtube.com/watch?v=HRb7B9fPhfA')));`,
    ],
    { encoding: 'utf8' },
  );

  expect(JSON.parse(output)).toEqual({
    id: 'HRb7B9fPhfA',
    mediaType: 'video',
    provider: 'youtube',
  });
});