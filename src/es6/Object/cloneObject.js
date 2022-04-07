/**
 * Requires
 */
import { isPojo } from './isPojo.js';

/**
 * Clone object or array
 * @param {Object|Array} source - Source to clone
 * @param {boolean} recursive - Recursive mode
 * @returns {Object|Array} - Cloned object or array
 */
export function cloneObject( source, recursive ) {
    recursive = !!recursive;
    const is_array = source instanceof Array;
    const is_plain = isPojo( source );
    const cloned = is_array ? [] : {};
    let i;
    if ( is_array || is_plain ) {
        for ( i in source ) {
            if ( Object.prototype.hasOwnProperty.call( source, i ) ) {
                if ( source[ i ] === null || typeof source[ i ] !== 'object' || !recursive ) {
                    cloned[ i ] = source[ i ];
                } else {
                    cloned[ i ] = cloneObject( source[ i ], recursive );
                }
            }
        }
        return cloned;
    }
    return source;
}
