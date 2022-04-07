/**
 * Requires
 */
import { leadingZeros } from '../Number/leadingZeros.js';

/**
 * String to time
 * TODO: requires some improvement
 * @param {string} value - Date string to parse
 * @returns {null|Date} - Null or a valid Date object
 */
export function str2time( value ) {
    if ( value instanceof Date ) {
        return value;
    }

    // Value must be at least 5 characters
    if ( !value || value.length < 5 ) {
        return null;
    }

    // Replace separators with spaces
    value = value.replace( /[-.,/]+/g, ' ' ).trim();

    // Parse to numbers
    const parts = value.split( /\s+/g ).map( ( v ) => { parseInt( v ); } );
    if ( parts.length !== 3 ) {
        return null;
    }

    // In case the value is day/month/year
    if ( parts[ 2 ] > 31 ) {
        parts.reverse();
    }

    // Check values
    const [ year, month, day ] = parts;
    if ( year < 1 || month < 1 || month > 12 || day < 1 || day > 31 ) {
        return null;
    }

    // Build date
    const date = Date.parse( [ leadingZeros( year, 4 ), leadingZeros( month ), leadingZeros( day ) ].join( '-' ) );
    return date && !isNaN( date ) ? new Date( date ) : null;
}
