/**
 * @callback DebounceEventHandler
 * @param {Event} event - Event object
 * @return {void}
 */

/**
 * Debounce event
 * @param {Function|DebounceEventHandler} func - Event handler
 * @param {null|number} delay - Debounce delay, default: 350
 * @return {function(*=): void} - Wrapped callback
 */
export function debounce( func, delay = null ) {
    delay = typeof delay === 'number' ? delay : 350;
    let timer = 0;
    return function( event ) {
        if ( timer ) {
            window.clearTimeout( timer );
            timer = 0;
        }
        timer = window.setTimeout( func, delay, event );
    };
}
