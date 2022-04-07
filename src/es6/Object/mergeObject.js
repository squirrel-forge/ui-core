/**
 * Requires
 */
import { mergeArray } from '../Array/mergeArray.js';
import { cloneObject } from './cloneObject.js';
import { isPojo } from './isPojo.js';

/**
 * Merge objects
 * @param {Object} target - Base object
 * @param {Object} changes - Changes object
 * @param {boolean} extend - Extend the base object
 * @param {boolean} recursive - Recursivly merge
 * @param {boolean} clone_array - Clone array values
 * @param {boolean} no_array_merge - Do not merge arrays
 * @return {Object} - Merged object
 */
export function mergeObject( target, changes, extend = false, recursive = false, clone_array = false, no_array_merge = true ) {
    extend = !!extend;
    recursive = !!recursive;
    clone_array = !!clone_array;
    no_array_merge = !!no_array_merge;

    let i,
        to_target,
        to_changes,
        array_target,
        array_changes,
        plain_target,
        plain_changes;

    for ( i in changes ) {

        // Update value
        if ( Object.prototype.hasOwnProperty.call( target, i ) && Object.prototype.hasOwnProperty.call( changes, i ) ) {
            to_target = typeof target[ i ];
            to_changes = typeof changes[ i ];
            array_target = target[ i ] instanceof Array;
            array_changes = changes[ i ] instanceof Array;
            plain_target = isPojo( target[ i ] );
            plain_changes = isPojo( changes[ i ] );

            switch ( to_target + '_' + to_changes ) {
            case 'object_object' :
                if ( recursive ) {
                    if ( !no_array_merge && array_target && array_changes ) {

                        // Array merging
                        target[ i ] = mergeArray( true, clone_array, target[ i ], changes[ i ] );
                    } else if ( plain_target && plain_changes ) {

                        // Plain object recursive
                        target[ i ] = mergeObject( target[ i ], changes[ i ], extend, recursive, clone_array, no_array_merge );
                    } else {

                        // Clone object
                        target[ i ] = cloneObject( changes[ i ], true );
                    }
                } else {

                    // No instance type checking
                    target[ i ] = changes[ i ];
                }
                break;
            default :

                // Replace if extend, null or both same type
                if ( extend || target[ i ] === null || changes[ i ] === null || to_target === to_changes ) {
                    target[ i ] = changes[ i ];
                }
            }

        // Extend value
        } else if ( extend && typeof target[ i ] === 'undefined' && Object.prototype.hasOwnProperty.call( changes, i ) ) {
            target[ i ] = cloneObject( changes[ i ], true );
        }
    }
    return target;
}
