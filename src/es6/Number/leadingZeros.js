/**
 * Leading Zero helper
 * @param {number} num - Number to add prefix
 * @param {number} length - Expected length
 * @return {string} - The prefixed number
 */
export function leadingZeros( num, length = 2 ) {
    num = num + '';
    while ( num.length < length ) {
        num = '0' + num;
    }
    return num;
}
