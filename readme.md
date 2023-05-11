# @revam/chinese-numeral-conversion

[![npm version](https://badge.fury.io/js/@revam%2Fchinese-numeral-conversion.svg)](https://badge.fury.io/js/@revam%2Fchinese-numeral-conversion)

A package for converting numerals between chinese words and numbers, with
support for different numeral label sets (such as Traditional Chinese and
Simplified Chinese, and/or a custom label set).

## Installation

To install this package, you can use either npm or yarn (or your other favorite
package manager):

- For npm, run the following command:

  ```sh
  npm install @revam/chinese-numeral-conversion
  ```

- For yarn, run the following command:

  ```sh
  yarn add @revam/chinese-numeral-conversion
  ```

## Usage

Some examples of how to use the package and its exported methods:

**Converting from words**:

```js
import { fromWords } from "@revam/chinese-numeral-conversion";

// Stringified digits.
let number = fromWords("13370");
console.log(number); // Output: 13370

number = fromWords("第13370");
console.log(number); // Output: 13370

// Traditional Chinese with units.
number = fromWords("一萬三千三百七十");
console.log(number); // Output: 13370

number = fromWords("第一萬三千三百七十");
console.log(number); // Output: 13370

// Simplified Chinese with units.
number = fromWords("一万三千三百七十");
console.log(number); // Output: 13370

number = fromWords("第一万三千三百七十");
console.log(number); // Output: 13370

// Just numerals.
number = fromWords("一三三七零");
console.log(number); // Output: 13370

number = fromWords("第一三三七零");
console.log(number); // Output: 13370

number = fromWords("一三三七〇");
console.log(number); // Output: 13370

number = fromWords("第一三三七〇");
console.log(number); // Output: 13370

```

**Converting to words**:

```js
import { SimplifiedChineseLabelSet, toOrdinal, toWords, toWordsOrdinal } from "@revam/chinese-numeral-conversion";

// Standard numberal digits.
const numeral = (13370).toString(10);
console.log(numeral); // Output: "13370"

// Convert a number to its word form in Traditional Chinese.
const traditionalWords = toWords(13370);
console.log(traditionalWords); // Output: "一萬三千三百七十"

// Convert a number to its word form Simplified Chinese.
const simplifiedWords = toWords(13370, SimplifiedChineseLabelSet);
console.log(simplifiedWords); // Output: "一万三千三百七十"



// Convert a number to its ordinal form using pure digits.
const ordinalNumeral = toOrdinal(13370);
console.log(ordinalNumeral); // Output: "第13370"

// Convert a number to its ordinal word form in Traditional Chinese.
const ordinalTraditionalWords = toWordsOrdinal(13370);
console.log(ordinalTraditionalWords); // Output: "第一萬三千三百七十"

// Convert a number to its ordinal word form in Simplified Chinese.
const ordinalSimplifiedWords = toWordsOrdinal(13370, SimplifiedChineseLabelSet);
console.log(ordinalSimplifiedWords); // Output: "第一万三千三百七十"

```

**Checking if a string is using traditional big units or simplified big units**:

```js
import { isSimplifiedChinese, isTraditionalChinese } from "@revam/chinese-numeral-conversion";

const traditionalWords = "一萬三千三百七十";
const simplifiedWords = "一万三千三百七十";

// Check if a stringified number is written as Traditional Chinese
let isTraditional = isTraditionalChinese(traditionalWords);
console.log(isTraditional); // Output: true

isTraditional = isTraditionalChinese(simplifiedWords);
console.log(isTraditional); // Output: false

// Check if a stringified number is written as Simplified Chinese
let isSimple = isSimplifiedChinese(traditionalWords);
console.log(isSimple); // Output: false

isSimple = isSimplifiedChinese(simplifiedWords);
console.log(isSimple); // Output: true

```

## TypeScript

This package includes TypeScript declarations for the package, providing type
checking, autocompletion, and documentation for the exported functions and
class. The package supports both ES Modules (mjs) and CommonJS (cjs) module
systems.

## Contributing

We gladly welcome contributions and corrections to improve the package. If you'd
like to contribute, feel free to submit a pull request, create an issue, or
reach out with your suggestions on the
[GitHub repository](https://github.com/revam/node-chinese-numeral-conversion).
You can also check the Issues and PR tabs for ongoing discussions and/or
contributions.

Your input and support are greatly appreciated!

## License

This package is available under the ISC license. See the
[license.txt](./license.txt) file for more details.
