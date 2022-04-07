/**
 * Run callback on document ready
 * @param {Function} callback - Function to execute on ready or right away
 * @return {void}
 */
export function docReady( callback ) {
    const d = document;
    if ( d.readyState === 'complete' || d.readyState !== 'loading' && !d.documentElement.doScroll ) {
        callback();
    } else {
        d.addEventListener( 'DOMContentLoaded', () => { callback(); } );
    }
}
