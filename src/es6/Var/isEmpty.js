/**
 * Requires
 */
import { isPojo } from '../Object/isPojo.js';

/**
 * Check if value is empty
 * @param {*} value - Check if the given value is empty
 * @return {boolean} - True if the value is empty
 */
export function isEmpty( value ) {

    // Explicit empty values
    if ( typeof value === 'undefined' || value === null || value === 0 || !value ) {
        return true;
    }

    // Get type and check
    switch ( typeof value ) {
    case 'string' :
        return !value.length;
    case 'object' :
        if ( value instanceof Date ) {
            return false;
        }
        if ( value instanceof Array ) {
            return !value.length;
        }
        if ( !isPojo( value ) ) {
            return typeof value.length !== 'undefined' ? !value.length : false;
        }
        return !Object.keys( value ).length;
    }

    // No idea, but it sure ain't empty
    return false;
}
