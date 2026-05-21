# Migration Guide (v1.0.0)

## What changed
- Modernized toolchain (ESLint/Jest/Rollup/TypeScript versions).
- Added export map support for stable package entry points.
- Added ESM distribution artifact: `dist/jsVideoUrlParser.esm.js`.
- Added CI/security/release workflows.
- Deprecated Bower distribution support.

## Compatibility guarantees
- Core API behavior is preserved for `parse`, `create`, and `bind`.
- Existing CommonJS usage (`require('js-video-url-parser')`) remains supported.
- Existing deep imports under `lib/*` remain supported.
- UMD artifacts remain available in `dist/`.

## Node and browser support
- Node.js: 18+
- Browser support follows modern evergreen targets via current Babel/Rollup pipeline.

## Removed/deprecated
- `bower.json` is removed.

## Recommended imports
### CommonJS
```js
const urlParser = require('js-video-url-parser');
```

### ESM
```js
import urlParser from 'js-video-url-parser';
```

### Deep provider import compatibility
```js
import 'js-video-url-parser/lib/provider/youtube';
```
