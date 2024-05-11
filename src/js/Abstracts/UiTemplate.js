/**
 * Requires
 */
import { Exception, isPojo, mergeObject, str2node } from '@squirrel-forge/ui-util';

/**
 * Ui template exception
 * @class
 * @extends Exception
 */
class UiTemplateException extends Exception {}

/**
 * @typedef {Object} UiTemplateData
 * @property {*} * - Any required template value
 */

/**
 * @typedef {Object} UiDefaultsTemplateData
 * @property {null|string[]} classes - List of classes
 * @property {null|string|string[]} attributes - List of attributes
 */

/**
 * @typedef {Object} UiProcessedDefaultsTemplateData
 * @property {string[]} classes - List of classes
 * @property {string[]} attributes - List of attributes
 */

/**
 * Ui template
 * @abstract
 * @class
 */
export class UiTemplate {

    /**
     * Load template from dom
     * @public
     * @static
     * @param {string} id - Element id
     * @return {string} - Template string
     */
    static dom( id ) {
        const template = document.getElementById( id );
        if ( !template ) throw new UiTemplateException( 'Template not found: ' + id );
        return template.innerHTML.trim();
    }

    /**
     * Template data
     * @private
     * @property
     * @type {null|Object}
     */
    #data = null;

    /**
     * Extend data
     * @private
     * @property
     * @type {boolean}
     */
    #extend = true;

    /**
     * Debug object
     * @public
     * @property
     * @type {null|console|Object}
     */
    debug = null;

    /**
     * Template render error output
     * @public
     * @property
     * @type {null|string}
     */
    errorMessage = null;

    /**
     * Template default data
     * @protected
     * @property
     * @type {null|Object}
     */
    _defaults = null;

    /**
     * Constructor
     * @constructor
     * @param {null|UiTemplateData|Object} data - Template data
     * @param {null|console} debug - Debug object
     */
    constructor( data = null, debug = null ) {
        this.debug = debug;
        if ( data ) this.data = data;
    }

    /**
     * Template render method
     * @abstract
     * @protected
     * @param {UiTemplateData|Object} data - Template data
     * @return {string} - Rendered template
     */
    _render( data ) {
        if ( this.debug ) this.debug.warn( this.constructor.name + '::_render', data );
        throw new UiTemplateException( 'Template requires a render method' );
    }

    /**
     * Template validate method
     * @abstract
     * @protected
     * @param {UiTemplateData|Object} data - Template data
     * @throws UiTemplateException
     * @return {void}
     */
    _validate( data ) {
        if ( this.debug ) this.debug.warn( this.constructor.name + '::_validate', data );
        throw new UiTemplateException( 'Template requires a validate method' );
    }

    /**
     * Extend getter
     * @public
     * @return {boolean}
     */
    get extend() {
        return this.#extend;
    }

    /**
     * Extend setter
     * @public
     * @param state
     */
    set extend( state ) {
        if ( typeof state !== 'boolean' ) throw new UiTemplateException( 'Extend must be a boolean value' );
        this.#extend = state;
    }

    /**
     * Data getter
     * @public
     * @return {Object|null} - Template data
     */
    get data() {
        return this.#data;
    }

    /**
     * Data setter
     * @public
     * @param {UiTemplateData|Object} data - Template data
     * @return {void}
     */
    set data( data ) {
        if ( !isPojo( data ) ) throw new UiTemplateException( 'Cannot set invalid template data, must be a plain object' );
        this.#data = data;
    }

    /**
     * Process default data
     * @protected
     * @param {UiTemplateData|Object} data - Data object
     * @param {UiDefaultsTemplateData|Object} defaults - Default data
     * @param {null|string} addId - Add id attribute
     * @return {UiProcessedDefaultsTemplateData} - Processed defaults
     */
    _process_defaults( data, defaults, addId = true ) {
        const classes = defaults?.classes || [];
        if ( data.classes instanceof Array ) {
            classes.push( ...data.classes );
        } else if ( typeof data.classes === 'string' ) {
            classes.push( data.classes );
        }
        const attributes = defaults?.attributes || [];
        if ( addId && data.id ) attributes.push( `id="${data.id}"` );
        if ( data.attributes instanceof Array ) {
            attributes.push( ...data.attributes );
        } else if ( typeof data.attributes === 'string' ) {
            attributes.push( data.attributes );
        }
        return { classes, attributes };
    }

    /**
     * Render template
     * @public
     * @param {null|UiTemplateData|Object} data - Template data
     * @return {string} - Rendered template
     */
    render( data = null ) {
        if ( !isPojo( this._defaults ) ) throw new UiTemplateException( 'Invalid template defaults data' );
        if ( data ) this.data = data;
        if ( !isPojo( this.#data ) ) throw new UiTemplateException( 'Invalid template data, must be a plain object' );
        const compiled = {};
        mergeObject( compiled, this._defaults, true, true );
        mergeObject( compiled, this.#data, this.#extend, true );
        this._validate( compiled );
        if ( this.debug ) this.debug.log( this.constructor.name + '::render', compiled );
        return this._render( compiled );
    }

    /**
     * Render multiple templates
     * @public
     * @param {Array<UiTemplateData|Object>} data - Template data list
     * @param {boolean} asArray - Return result as array
     * @return {string|Array<string>} - Rendered templates
     */
    loop( data, asArray = false ) {
        const result = [];
        for ( let i = 0; i < data.length; i++ ) {
            result.push( this.render( data ) );
        }
        return asArray ? result : result.join( '' );
    }

    /**
     * Render as node
     * @public
     * @param {null|UiTemplateData|Object|Array<UiTemplateData|Object>} data - Template data /list
     * @return {NodeList|Array} - Rendered nodes or empty array
     */
    node( data = null ) {
        const rendered = data instanceof Array ?
            this.loop( data ) : this.render( data );
        if ( rendered ) return str2node( rendered );
        return [];
    }

    /**
     * Append rendered template
     * @public
     * @param {HTMLElement} to - Element to append to
     * @param {null|Object|Array} data - Template data /list
     * @return {NodeList|Array} - Rendered nodes or empty array
     */
    append( to, data = null ) {
        if ( !( to instanceof HTMLElement ) ) throw new UiTemplateException( 'Requires a HTMLElement to append to' );
        const nodes = this.node( data );
        for ( let i = 0; i < nodes.length; i++ ) {
            to.appendChild( nodes[ i ] );
        }
        return nodes;
    }

    /**
     * To string conversion
     * @public
     * @return {string} - rendered template
     */
    toString() {
        let rendered;
        try {
            rendered = this.render();
        } catch ( e ) {
            if ( this.debug ) this.debug.error( this.constructor.name + '::toString', e );
            rendered = this.errorMessage;
        }
        if ( typeof rendered !== 'string' ) {
            rendered = `<!-- render error: ${this.constructor.name} with: ${JSON.stringify( this.#data )} -->`;
        }
        return rendered;
    }
}
