/**
 * Get scrollbar width
 * @return {number} - Scrollbar width in pixels
 */
export function getScrollbarWidth() {
    const scrollable = document.createElement( 'div' );
    const content = document.createElement( 'div' );
    const styles = [
        'z-index:-1',
        'position:fixed',
        'width:50vw;',
        'height:50vh;',
        'visibility:hidden',
        'overflow:scroll',
        '-ms-overflow-style:scrollbar',
    ];
    scrollable.setAttribute( 'style', styles.join( ';' ) );
    content.setAttribute( 'style', 'display:block;width:100%;height:100vh' );
    scrollable.appendChild( content );
    document.body.appendChild( scrollable );
    const width = scrollable.offsetWidth - content.offsetWidth;
    document.body.removeChild( scrollable );
    return width;
}
