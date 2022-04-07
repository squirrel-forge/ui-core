/**
 * Generate a random string
 * @param {boolean} entropy - True for higher entropy
 * @return {string} - A random string
 */
export function strand( entropy = false ) {
    const time = !entropy ? '' : '-'
        + ( performance.now() + '' ).replace( /\./g, '-' );
    return Math.random().toString( 36 ).substring( 2, 12 ) + time;
}
