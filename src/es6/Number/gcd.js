/**
 * Get the common denominator
 * @param {number} a - Number
 * @param {number} b - Number
 * @return {number} - Number
 */
export function gcd( a, b ) {
    return b === 0 ? a : gcd( b, a % b );
}
