/**
 * Requires
 */
import { cloneObject } from '../Object/cloneObject.js';

/**
 * Merge 2 or more arrays and return new array
 * @param {boolean} unique - Only unique values, optional, default : true
 * @param {boolean} clone - Clone values, optional, default : false
 * @param {Array} args - Any number of arrays to merge
 * @return {Array} - Merged array
 */
export function mergeArray( ...args ) {
    const merged = [];
    let argsset = 0,
        unique = true,
        clone = false;
    for ( let i = 0; i < args.length; i++ ) {
        if ( args[ i ] instanceof Array ) {
            args[ i ].forEach( ( value ) => {
                if ( !unique || unique && !merged.includes( value ) ) {
                    merged.push( clone ? cloneObject( value ) : value );
                }
            } );

        // Parse first three non array arguments as booleans
        } else if ( argsset < 2 ) {
            if ( argsset === 0 ) {
                unique = !!args[ i ];
            } else if ( argsset === 1 ) {
                clone = !!args[ i ];
            }
            argsset++;
        }
    }
    return merged;
}
