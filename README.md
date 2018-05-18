# BrowseDown

BrowseDown is an browser-based alternative to level-down,
which can be used as a backend for 
[level-up](https://github.com/Level/levelup),
thus allowing you to use the same storage in node, browser, 
react-native, and mongodb.

There is another an in-browser implementation of this called 
[level.js](https://github.com/level/level.js), which this
is heavily inspired on. Unfortunately, it seems to be
unmaintained and is 
[no longer compatible with level-up](https://github.com/Level/level.js/issues/59).

This version is also writen on top of the useful
[IDBWrapper](https://github.com/jensarps/IDBWrapper/)
library, and I was inspired by their karma tests.
I wrote the BrowseDown in Typescript and transpiled
it to Javascript for npm. I also imported the entire
test suite from [abstract-leveldown](https://github.com/Level/abstract-leveldown/tree/master/abstract)
and run them in with karma and tape in the browser.

This is tested with new versions of Firefox and Chrome on
OSX and Linux. I am happy for any more testing.

## Usage

To add it to your project, just:

```console
npm install browsedown
```

Then use it like this:

```javascript
import {browsedown} from 'browsedown';
import levelup from 'levelup';

const db = levelup(browsedown('idb-store-name'));
```

## Dev Commands

```console
yarn install
yarn test
yarn build
```