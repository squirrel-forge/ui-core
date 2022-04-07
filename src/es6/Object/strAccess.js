/**
 * Access object value by dot syntax string
 * @param {string} strpath - Dotted value path
 * @param {Object} subject - Object to access
 * @param {boolean} exact - Whether to match only an exact value, default: true
 * @param {null|console} debug - Debugger instance
 * @return {null|*} - Closest value matched to path, or in exact mode, null is returned for no match
 */
export function strAccess( strpath, subject, exact = true, debug = null ) {

    if ( typeof subject !== 'object' || subject === null ) {
        if ( debug ) {
            debug.error( 'strAccess : invalid subject input : ', subject );
        }
        return null;
    }

    const parts = strpath.split( '.' );
    const path = [];

    let i, to, part, value = subject;

    // Check path
    for ( i = 0; i < parts.length; i++ ) {
        part = parts[ i ];
        path.push( part );
        to = Object.prototype.hasOwnProperty.call( value, part ) ? typeof value[ part ] : 'undefined';
        if ( value[ part ] === null ) {
            to = 'undefined';
        }

        // Path exists
        if ( to !== 'undefined' ) {

            // Last element in path is always a valid result
            if ( i === parts.length - 1 ) {
                return value[ part ];

                // Continue iterating the path
            } else if ( to === 'object' ) {
                value = value[ part ];

                // Its not the last and not an object, for exact we have a mismatch
            } else if ( exact ) {
                if ( debug ) {
                    debug.warn( 'strAccess : no exact match for "' + strpath + '" found "' + path.join( '.' ) + '" [' + to + ']' );
                }
                return null;

                // When not expecting an exact value, return what we got
            } else {
                return value;
            }

            // Path not defined, but exact value expected
        } else if ( exact ) {
            if ( debug ) {
                debug.warn( 'strAccess : no exact match for "' + strpath + '" found "' + path.join( '.' ) + '" [' + to + ']' );
            }
            return null;

            // Return what we got
        } else {
            return value;
        }
    }
}
