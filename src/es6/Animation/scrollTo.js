/**
 * Scroll to element with offset
 * @param {HTMLElement} element - Target element
 * @param {number|HTMLElement} offset - Offset in pixels or HTMLElement.height
 * @param {string} behavior - Scroll behaviour
 * @param {number} minDiff - Minimum scroll difference required
 * @return {void}
 */
export function scrollTo( element, offset = 0, behavior = 'smooth', minDiff = 3 ) {
    if ( offset instanceof HTMLElement ) {
        offset = offset.getBoundingClientRect().height + offset.getBoundingClientRect().top;
    } else if ( offset !== null && ( typeof offset !== 'number' || Number.isNaN( offset ) ) ) {
        throw new Error( 'scrollTo() Argument offset must be a HTMLElement or number' );
    }
    const top = document.documentElement.scrollTop + element.getBoundingClientRect().top - offset;
    if ( Math.abs( document.documentElement.scrollTop - top ) >= minDiff ) {
        window.scrollTo( { top, behavior } );
    }
}
