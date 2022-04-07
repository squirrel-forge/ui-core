/**
 * Unwrap
 * Removes the given element and preserves any children
 * @param {HTMLElement} element - Element wrapper to remove
 * @throws Error
 * @return {void}
 */
export function unwrap( element ) {

    // Check for a valid element
    if ( !( element instanceof HTMLElement || !element.isConnected ) ) {
        throw new Error( 'unwrap(element) Must be a valid HTMLElement' );
    }

    // Unwrap children if available
    if ( element.hasChildNodes() ) {
        element.replaceWith( ...element.childNodes );
    } else {

        // Remove element if it has no children
        element.remove();
    }
}
