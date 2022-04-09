/**
 * Wrap element/s
 * Wraps given element or elements with a given element
 * @param {HTMLElement|NodeList|Array<HTMLElement>} elements - Element/s to wrap
 * @param {HTMLElement|string} wrapper - Tag name or element to wrap given elements with
 * @param {boolean} strict - Causes an error if the wrapper element is already connected to a DOM
 * @throws Error
 * @return {HTMLElement} - Wrapper element reference
 */
export function wrap( elements, wrapper = 'div', strict = true ) {

    // Ensure valid element/s to wrap
    if ( !( elements instanceof HTMLElement || elements instanceof NodeList || elements instanceof Array ) ) {
        throw new Error( 'wrap() Argument elements must be a valid HTMLElement, NodeList or Array containing only HTMLElement\'s' );
    }

    // Strict check or create wrapper
    if ( typeof wrapper === 'string' ) {
        wrapper = document.createElement( wrapper );
    } else if ( strict && wrapper instanceof HTMLElement && wrapper.isConnected ) {
        throw new Error( 'wrap() Argument wrapper must not be part of the dom' );
    }

    // Wrapper must be an element
    if ( !( wrapper instanceof HTMLElement ) ) {
        throw new Error( 'wrap() Argument wrapper must be a valid Tag name or HTMLElement' );
    }

    // Ensure an array of elements
    if ( elements instanceof NodeList ) {
        elements = Array.prototype.slice.call( elements );
    } else if ( elements instanceof HTMLElement ) {
        elements = [ elements ];
    }

    // Insert wrapper before first list element
    elements[ 0 ].parentElement.insertBefore( wrapper, elements[ 0 ] );

    // Move all elements to the wrapper
    for ( let i = 0; i < elements.length; i++ ) {
        wrapper.appendChild( elements[ i ] );
    }

    // Return the wrapper for reference
    return wrapper;
}
