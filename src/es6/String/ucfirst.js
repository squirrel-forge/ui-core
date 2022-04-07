/**
 * Capitalize first character
 * Equivalent to PHPs ucfirst
 * @param {string} str - Subject string to be modified
 * @return {string} - Capitalized first character of string
 */
export function ucfirst( str ) {
    return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}
