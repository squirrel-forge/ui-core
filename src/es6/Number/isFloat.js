/**
 * Value is float value
 * @param {number} num - Number to check
 * @return {boolean} - True if value is a float
 */
export function isFloat( num ) {
    return Number( num ) === num && num % 1 !== 0;
}
