/**
 * @typedef {Object} ElementVisibilityObject
 * @property {number} elem - Element visibility in percent
 * @property {number} height - Element visibility in pixels
 * @property {number} view - Vertical view percentage covered
 */

/**
 * Get element vertical visibility
 * @param {HTMLElement} element - Target element
 * @param {null|HTMLElement} container - Scroll container
 * @return {ElementVisibilityObject} - Visibility data
 */
export function getVisibility( element, container = null ) {
    const pos = element.getBoundingClientRect();
    const scrollTop = container ? container.scrollTop : document.documentElement.scrollTop;
    const top = scrollTop + pos.y;
    const element_height = pos.height;
    const window_height = container ? container.getBoundingClientRect().height : window.innerHeight;
    const hidden_before = scrollTop - top;
    const hidden_after = top + element_height - ( scrollTop + window_height );
    let height = 0, view = 0, elem = 0;

    // Fully or partially visible
    if ( !( scrollTop > top + element_height || top > scrollTop + window_height ) ) {
        elem = 100;
        if ( hidden_before > 0 ) elem -= hidden_before * 100 / element_height;
        if ( hidden_after > 0 ) elem -= hidden_after * 100 / element_height;
    }

    // Calculate visible height and relative to viewport
    if ( elem ) {
        height = element_height - ( hidden_before < 0 ? 0 : hidden_before ) - ( hidden_after < 0 ? 0 : hidden_after );
        view = height * 100 / window_height;
    }
    return { elem, height, view };
}
