/**
 * Get json object from element attribute
 * @param {string} name - Attribute name
 * @param {HTMLElement} element - Target element
 * @param {boolean} silent - Do not throw exception on error but return null, default: true
 * @return {null|Object} - Null or successfully parsed data
 */
export function attributeJSON( name, element, silent = true ) {
    const value = element.getAttribute( name );
    if ( typeof value !== 'string' || !value.length ) {
        return null;
    }
    let result;
    try {
        result = JSON.parse( value );
    } catch ( error ) {
        if ( !silent ) throw error;
        return null;
    }
    return result;
}
