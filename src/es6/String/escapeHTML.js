/**
 * Escape html special chars
 * @param {string} text - String to escape
 * @return {string} - Escaped html string
 */
export function escapeHTML( text ) {
    const map = { '&' : '&amp;', '<' : '&lt;', '>' : '&gt;', '"' : '&quot;', "'" : '&#039;' };
    return text.replace( /[&<>"']/g, ( m ) => { return map[ m ]; } );
}
