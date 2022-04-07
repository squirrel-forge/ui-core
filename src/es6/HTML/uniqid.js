/**
 * Requires
 */
import { strand } from '../String/strand.js';

/**
 * Unique html attribute id
 * @param {string} prefix - Prefix the random id
 * @param {boolean} entropy - True for higher entropy
 * @return {string} - An unused unique random id
 */
export function uniqid( prefix = '', entropy = false ) {
    prefix = prefix || '';
    let id;
    do {
        id = prefix + strand( entropy );
    } while ( document.getElementById( id ) );
    return id;
}

/**
 * Require unique id
 * @param {HTMLElement} element - Element that requires an id
 * @param {string} prefix - Prefix the random id
 * @param {boolean} entropy - True for higher entropy
 * @return {string} - Current or created element id
 */
export function requireUniqid( element, prefix, entropy ) {
    const id = element.id || uniqid( prefix, entropy );
    element.id = id;
    return id;
}
