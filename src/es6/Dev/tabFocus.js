/**
 * Set tabfocus style
 * @private
 * @param {HTMLElement} element - Element
 * @param {string} style - CSS outline style
 * @param {string} offset - CSS outline offset
 * @return {void}
 */
function _set_style( element, style, offset ) {
    element.style.outline = style;
    element.style.outlineOffset = offset;
}

/**
 * Reset tabfocus style
 * @private
 * @param {HTMLElement} element - Element
 * @return {void}
 */
function _reset_style( element ) {
    element.style.outline = '';
    element.style.outlineOffset = '';
}

/**
 * Display outline on focused elements
 * @description Binds a global event to highlight elements focused by keyboard control and returns a callback to unbind.
 * @public
 * @param {string} style - CSS outline style
 * @param {string} offset - CSS outline offset
 * @param {boolean} log - Log focused element to console
 * @return {Function} - Callback to remove tabFocus
 */
export function tabFocus( style = '2px dashed deeppink', offset = '4px', log = true ) {

    /**
     * Focus handler
     * @private
     * @param {Event} event - Focus event
     * @return {void}
     */
    const _focus_handler = ( event ) => {

        // Check tab button
        const key = event.keyCode || event.key;
        if ( key === 9 ) {

            // Set active element
            const active = document.activeElement;
            _set_style( active, style, offset );
            if ( active.nextElementSibling && active.nextElementSibling.classList.contains( 'input__pseudo' ) ) {
                _set_style( active.nextElementSibling, style, offset );
            }

            /**
             * Reset last focused element
             * @private
             * @return {void}
             */
            const _tabFocus_remove_active = function _tabFocus_remove_active() {

                // Reset styles
                _reset_style( active );
                if ( active.nextElementSibling && active.nextElementSibling.classList.contains( 'input__pseudo' ) ) {
                    _reset_style( active.nextElementSibling );
                }

                // Remove blur handler
                active.removeEventListener( 'blur', _tabFocus_remove_active );
            };

            // Add removal listener
            active.addEventListener( 'blur', _tabFocus_remove_active );

            // Notify in console
            if ( log ) window.console.log( '> tabfocus <', document.activeElement );
        }
    };

    // Bind handler
    document.addEventListener( 'keyup', _focus_handler );

    // Return removal callback
    return () => { document.removeEventListener( 'keyup', _focus_handler ); };
}
