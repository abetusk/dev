# fast-unique-numbers

**A module to create a set of unique numbers as fast as possible.**

[![tests](https://img.shields.io/travis/chrisguttandin/fast-unique-numbers/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/fast-unique-numbers)
[![dependencies](https://img.shields.io/david/chrisguttandin/fast-unique-numbers.svg?style=flat-square)](https://www.npmjs.com/package/fast-unique-numbers)
[![version](https://img.shields.io/npm/v/fast-unique-numbers.svg?style=flat-square)](https://www.npmjs.com/package/fast-unique-numbers)

This module is meant to create unique numbers within a given [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) or [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). To achieve that as fast as possible the resulting set of numbers will only contain integers. For as long as possible only small integers will be used. This is a special integer representation that [V8](https://v8.dev) uses to store integers more efficiently.

To verify the expected perfomance benefit an expectation test is used to make sure small integers do actually perform better. A complementary test is used to make sure the perfomance gain achieved in Chromium based browsers and Node.js is not negated by causing unexpected behavior when running in Firefox.

## Usage

This module is available on [npm](https://www.npmjs.com/package/fast-unique-numbers) and can be
installed by running the following command:

```shell
npm install fast-unique-numbers
```

This module exports two functions.

### addUniqueNumber()

This function takes a `Set` of numbers as argument and appends a new unique number to it. It also returns that number.

```js
import { addUniqueNumber } from 'fast-unique-numbers';

const set = new Set([ 1, 4, 8 ]);
const uniqueNumber = addUniqueNumber(set);

console.log(uniqueNumber); // 3
console.log(set); // Set(4) { 1, 4, 8, 3 }
```

### generateUniqueNumber()

This function can be used to generate a unique number which is not yet present in the given `Set` or is no key in the given `Map`. The resulting number gets not appended. It only gets returned.

```js
import { generateUniqueNumber } from 'fast-unique-numbers';

const map = new Map([
    [ 1, 'something' ],
    [ 4, 'something else' ]
]);

const uniqueNumber = generateUniqueNumber(map);

console.log(uniqueNumber); // 2
```
