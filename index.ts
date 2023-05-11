
const IsTraditionalRegex = /[萬億點負溝澗載]/;

const IsSimpleRegex = /[万亿点负沟涧载]/;

const PureDigitsRegex = /^\-?\d+(?<isPercise>\.(?<isFloat>\d*))?$/;

const NonStandardRegexMap = new WeakMap<NumeralLabelSet, RegExp>();

const UnitMap = new WeakMap<NumeralLabelSet, string[]>();

/**
 * The label set used by {@link NumeralConversion}.
 */
export interface NumeralLabelSet {
  /**
   * The ten base digits to use.
   */
  digits: [string, string, string, string, string, string, string, string, string, string, string];
  /**
   * The three small units.
   */
  smallUnits: [string, string, string];
  /**
   * The big units.
   */
  bigUnits: string[];
  /**
   * Ordinal symbol(s).
   */
  ordinal: [string, ...string[]];
  /**
   * Point symbol(s).
   */
  point: [string, ...string[]];
  /**
   * Minus symbol(s).
   */
  minus: [string, ...string[]];
}

/**
 * The label set for Simplified Chinese.
 */
export const SimplifiedChineseLabelSet: Readonly<NumeralLabelSet> = {
  digits: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "〇"],
  smallUnits: ["十", "百", "千"],
  bigUnits: ["万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载"],
  ordinal: ["第"],
  point: ["点", "."],
  minus: ["负", "-"],
};

/**
 * The label set for Traditional Chinese.
 */
export const TraditionalChineseLabelSet: Readonly<NumeralLabelSet> = {
  digits: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "〇"],
  smallUnits: ["十", "百", "千"],
  bigUnits: ["萬", "億", "兆", "京", "垓", "秭", "穰", "溝", "澗", "正", "載"],
  ordinal: ["第"],
  point: ["點", "."],
  minus: ["負", "-"],
};

/**
 * Check if the stringified number is written as Simplified Chinese.
 *
 * @param str - The strigified number to check.
 * @returns True if the stringified number is gurenteed to be written as
 * Simplified Chinese.
 */
export function isSimplifiedChinese(str: string): boolean {
  return IsSimpleRegex.test(str);
}

/**
 * Check if the stringified number is written as Traditional Chinese.
 *
 * @param str - The strigified number to check.
 * @returns True if the stringified number is gurenteed to be written as
 * Traditional Chinese.
 */
export function isTraditionalChinese(str: string): boolean {
  return IsTraditionalRegex.test(str);
}

/**
   * Converts the number to an ordinal form according to the given `labels`.
   *
   * @param num - Number to convert.
   * @param labels - Optional. Label set to use for the conversion.
   * @returns The number in ordinal form according to the label set.
   */
export function toOrdinal(num: number, labels: Readonly<NumeralLabelSet> = TraditionalChineseLabelSet) {
  return labels.ordinal[0] + num;
}

/**
 * Converts the number to an stringified form according to the given `labels`.
 *
 * @param num - Number to convert.
 * @param labels - Optional. Label set to use for the conversion.
 * @returns The number in stringified form according to the label set.
 */
export function toWords(num: number, labels?: Readonly<NumeralLabelSet>): string;
/**
 * Converts the number to an stringified form according to the default label set.
 *
 * @param num - Number to convert.
 * @param isCheque - Optional. Will retain the extra character for 10-19.
 * @returns The number in stringified form according to the label set.
 */
export function toWords(num: number, isCheque: boolean): string;
/**
 * Converts the number to an stringified form according to the given `labels`.
 *
 * @param num - Number to convert.
 * @param labels - Optional. Label set to use for the conversion.
 * @param isCheque - Optional. Will retain the extra character for 10-19.
 * @returns The number in stringified form according to the label set.
 */
export function toWords(num: number, labels?: Readonly<NumeralLabelSet>, isCheque?: boolean): string;
export function toWords(num: number, labels?: Readonly<NumeralLabelSet> | boolean, isCheque?: boolean): string {
  // Shift inputs.
  if (typeof labels === "boolean") {
    isCheque = labels;
    labels = TraditionalChineseLabelSet;
  }
  // Set default labels to use.
  else if (!labels) {
    labels = TraditionalChineseLabelSet;
  }

  return intToChinese(num, labels, isCheque) + floatToChinese(num, labels);
}

/**
 * Converts the number to an ordinal stringified form according to the given `labels`.
 *
 * @param num - Number to convert.
 * @param labels - Optional. Label set to use for the conversion.
 * @returns The number in ordinal stringified form according to the label set.
 */
export function toWordsOrdinal(num: number, labels?: Readonly<NumeralLabelSet>): string;
/**
 * Converts the number to an ordinal stringified form according to the default label set.
 *
 * @param num - Number to convert.
 * @param isCheque - Optional. Will retain the extra character for 10-19.
 * @returns The number in ordinal stringified form according to the label set.
 */
export function toWordsOrdinal(num: number, isCheque: boolean): string;
/**
 * Converts the number to an ordinal stringified form according to the given `labels`.
 *
 * @param num - Number to convert.
 * @param labels - Optional. Label set to use for the conversion.
 * @param isCheque - Optional. Will retain the extra character for 10-19.
 * @returns The number in ordinal stringified form according to the label set.
 */
export function toWordsOrdinal(num: number, labels?: Readonly<NumeralLabelSet>, isCheque?: boolean): string;
export function toWordsOrdinal(num: number, labels?: Readonly<NumeralLabelSet> | boolean, isCheque?: boolean): string {
  // Shift inputs.
  if (typeof labels === "boolean") {
    isCheque = labels;
    labels = TraditionalChineseLabelSet;
  }
  // Set default labels to use.
  else if (!labels) {
    labels = TraditionalChineseLabelSet;
  }

  return labels.ordinal + intToChinese(num, labels, isCheque) + floatToChinese(num, labels);
}

/**
 * Convert a stringified number — regardless of how it's written — to a `Number` instance.
 *
 * @param str - The stringified number to parse.
 * @param labels - Optional. Labels to use for parsing.
 * @returns The parsed number. Will return `NaN` if it fails to parse a number from `str`.
 */
export function fromWords(str: string, labels?: Readonly<NumeralLabelSet>): number {
  // Invalid input.
  if (typeof str !== "string") {
    return NaN;
  }

  // Empty input.
  if (!str) {
    return 0;
  }

  // No labels were suppied, take a guess.
  if (!labels) {
    labels = isSimplifiedChinese(str) ? SimplifiedChineseLabelSet : TraditionalChineseLabelSet;
  }

  // Remove any ordinal characters at the start (if any).
  for (const ordinal of labels.ordinal) {
    if (str.startsWith(ordinal)) {
      str = str.slice(ordinal.length);
    }
  }

  // Check for pure digits.
  {
    const result = PureDigitsRegex.exec(str);
    if (result !== null) {
      const { isPercise, isFloat } = result.groups!;
      if (isPercise) {
        if (isFloat) {
          return parseFloat(str);
        }

        str = str.slice(0, -1);
      }
      return parseInt(str, 10);
    }
  }

  // Check for non-standard numerals.
  {
    const regex = getNonStandardNumeralRegexForLabels(labels);
    const result = regex.exec(str);
    if (result?.groups) {
      const numerals = result.groups.numerals.split("").reverse();
      const digits = labels.digits;
      const value = numerals.reduce((current, numeral, index) => {
        const multiplier = index ? 10 ** index : 1;
        let baseValue = digits.indexOf(numeral);
        if (baseValue >= 10) {
          baseValue = baseValue % 10;
        }

        const nextValue = baseValue * multiplier;
        return current + nextValue;
      }, 0);

      return value;
    }
  }

  // Convert from chinese using the selected label set.
  return chineseToInt(str, labels) + chineseToFloat(str, labels);
}

export default fromWords;

function getNonStandardNumeralRegexForLabels(labels: NumeralLabelSet): RegExp {
  let regex = NonStandardRegexMap.get(labels);
  if (regex) {
    return regex;
  }

  regex = new RegExp(`^(?<numerals>[${labels.digits.join("")}]+)$`);
  NonStandardRegexMap.set(labels, regex);
  return regex;
}

function getUnits(labels: NumeralLabelSet): string[] {
  let units = UnitMap.get(labels);
  if (units) {
    return units;
  }

  units = ["", ...labels.bigUnits.flatMap((s) => [...labels.smallUnits, s])];
  UnitMap.set(labels, units);
  return units;
}

function intToChinese(num: number, labels: NumeralLabelSet, isCheque?: boolean | undefined): string {
  const { digits, minus: [minus] } = labels;
  const isNegative = num < 0;

  num = Math.floor(Math.abs(num));
  if (num === 0) {
    return (isNegative ? minus : "") + digits[0];
  }

  let str = "";
  let unitIndex = 0;
  const units = getUnits(labels);
  while (num > 0) {
    const unit = units[unitIndex++];
    const value = num % 10;
    const digit = digits[value];
    str = digit + unit + str;
    num = Math.floor(num / 10);
  }

  str = sanetizeNumeral(str, labels);

  if (!isCheque) {
    // Check writing reserve the first "一"
    str = str.replace(new RegExp("^" + digits[1] + units[1]), units[1])
  }

  return (isNegative ? minus : "") + str;
}

function floatToChinese(num: number, labels: NumeralLabelSet): string {
  if (num % 1 == 0) {
    return "";
  }

  let str = "";
  let value = parseInt(Math.abs(num).toString().replace(/^\d+./i, ""));
  const { digits, point: [point] } = labels;
  while (value > 0) {
    let index = value % 10;
    if (index === 0) index = 10;
    str = digits[index] + str;
    value = Math.floor(value / 10);
  }

  return point + str;
}

function sanetizeNumeral(str: string, labels: NumeralLabelSet): string {
  const zero = labels.digits[0];
  const zeroAlt = labels.digits[10];
  const digits = labels.digits.join("");
  const smallUnits = labels.smallUnits.join("");
  const bigUnits = labels.bigUnits.join("");
  str = str
    // Group small empty (zero) units as a single character, e.g. 零千,零百,零十 keeps 零.
    .replace(new RegExp(`[${zero}${zeroAlt}][${smallUnits}]`, "g"), zero)
    // Remove big units if there is no small units in-between two units, only zero (see above).
    .replace(new RegExp(`([${bigUnits}])[^${smallUnits}]+[${bigUnits}]`, "g"), "$1" + zero)
    // Remove zero's in-between big units.
    .replace(new RegExp(`([${smallUnits}])[${zero}${zeroAlt}]([${bigUnits}])`, "g"), "$1$2" + zero)
    .replace(new RegExp(`[${zero}${zeroAlt}]([${digits}])`, "g"), "$1")
    // Squash zeros into a single character.
    .replace(new RegExp(`[${zero}${zeroAlt}]+`, "g"), zero)
    ;

  // Remove tailing zero but not zero itself.
  return str.length > 1 ? str.replace(new RegExp(`[${zero}${zeroAlt}]+$`), "") : str;
}

function chineseToInt(str: string, labels: NumeralLabelSet): number {
  const { bigUnits, digits, minus, smallUnits } = labels;

  // Remove any decimals if found.
  for (const point of labels.point) {
    let pointIndex = str.indexOf(point);
    if (pointIndex !== -1) {
      str = str.slice(0, pointIndex);
      break;
    }
  }

  // Check if the value is negaive, and strip the character if it is.
  let isNegative = new RegExp(`^[${minus.join("")}]`).exec(str);
  if (isNegative) {
    str = str.slice(isNegative[0].length);
  }

  // Sanetize the input.
  str = sanetizeNumeral(str, labels);
  if (str.length === 0) {
    return NaN;
  }

  // Fast-path if the string is now just zero.
  if (str === digits[0]) {
    return 0;
  }

  // Convert "十" to "一十", but only if it starts with "十".
  if (new RegExp(`^${smallUnits[0]}`).test(str)) {
    str = digits[1] + str;
  }

  let num = 0;
  let index = 0;
  do {
    let step = 1;
    const char = str[index];
    const nextChar = str[index + step] ?? "";
    let baseValue = digits.findIndex((v) => v === char);
    if (baseValue === -1) {
      if (bigUnits.includes(nextChar)) {
        index += step;
        continue;
      }

      return NaN;
    }

    if (baseValue >= 10) {
      baseValue = baseValue % 10;
    }

    if (nextChar === "") {
      num += baseValue;
    }
    else if (smallUnits.includes(nextChar)) {
      step++;
      let regexResult: null | RegExpExecArray = null;
      regexResult = new RegExp(`^(?:[${digits.join("")}][${smallUnits.join("")}]){0,2}(?:[${digits.join("")}]?(?<bigUnit>[${bigUnits.join("")}]))`).exec(str.slice(index + step));
      if (regexResult === null) {
        regexResult = new RegExp(`^(?:[${digits.join("")}][${smallUnits.join("")}]){0,2}[${digits.join("")}]?$`).exec(str.slice(index + step));
      }
      if (regexResult === null) {
        return NaN;
      }

      let multiplier = 10 ** (smallUnits.findIndex((v) => v === nextChar) + 1);
      if (regexResult !== null && regexResult.groups && regexResult.groups.bigUnit !== undefined) {
        const bigUnit = regexResult.groups.bigUnit;
        multiplier *= bigUnits.reduce((c, s, i) => s === bigUnit ? (10 ** (4 * (i + 1))) : c, 1);
      }

      num += baseValue * multiplier;
    }
    else if (bigUnits.includes(nextChar)) {
      step++;
      const multiplier = bigUnits.reduce((c, s, i) => s === nextChar ? (10 ** (4 * (i + 1))) : c, 1);
      num += baseValue * multiplier;
    }
    else {
      return NaN;
    }

    index += step;
  } while (index < str.length);

  // Conditionally convert the output.
  return isNegative ? -num : num;
}

function chineseToFloat(str: string, labels: NumeralLabelSet): number {
  // Check if the value is negaive.
  let isNegative = new RegExp(`^[${labels.minus.join("")}]`).test(str);

  for (const point of labels.point) {
    // The point character was not found.
    let pointIndex = str.indexOf(point);
    if (pointIndex === -1) {
      continue;
    }

    // End of string.
    if (pointIndex + 1 >= str.length) {
      return 0;
    }

    // A point character was found.
    str = str.slice(pointIndex + 1);

    // Check if it's pure digits.
    if (/^\d+$/.test(str)) {
      return parseFloat(`0.${str}`);
    }

    // Check for stringified digits.
    const { digits } = labels;
    let decimals = 0;
    let index = 0;
    do {
      const char = str[index++];
      let value = digits.findIndex((v) => v === char);
      if (value === -1) {
        return NaN;
      }

      if (value >= 10) {
        value % 10;
      }

      decimals += value * (10 ** -(index));
    } while (index < str.length);

    // Conditionally convert the output.
    return isNegative ? -decimals : decimals;
  }

  // No point characters were found.
  return 0;
}
