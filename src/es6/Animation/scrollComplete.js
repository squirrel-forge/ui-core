/**
 * Run handler after scroll complete
 * @param {Function} callback - Complete callback
 * @param {number} call_delay - Internal check/call delay
 * @param {null|Object} context - Context to bind events, default: window
 * @return {void}
 */
export function scrollComplete( callback, call_delay = 300, context = null ) {

    // Require context
    if ( !context ) context = window;

    // Check callback
    if ( typeof callback !== 'function' ) {
        throw new Error( 'scrollComplete() Argument callback must be a Function' );
    }

    // Local timeout reference
    let timer;

    // Event options
    const options = { passive : true };

    /**
     * Internal complete handler
     * @private
     * @return {void}
     */
    const _scroll_complete = () => {
        window.clearTimeout( timer );
        timer = window.setTimeout( () => {

            // Remove listener, it's no longer needed since we have completed
            context.removeEventListener( 'scroll', _scroll_complete, options );

            // Attempt to run callback and catch/notify errors
            try {
                callback();
            } catch ( e ) {
                window.console.error( e );
                throw new Error( 'scrollComplete() Argument callback caused an error' );
            }
        }, call_delay );
    };

    // Bind to scroll event
    context.addEventListener( 'scroll', _scroll_complete, options );
}
