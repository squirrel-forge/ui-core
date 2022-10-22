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
    static getTemplate( id ) {
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
     * @param {null|Object} data - Template data
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
     * @param {Object} data - Template data
     * @return {string} - Rendered template
     */
    _render( data ) {
        if ( this.debug ) this.debug.warn( data );
        throw new UiTemplateException( 'Template requires a render method' );
    }

    /**
     * Template validate method
     * @abstract
     * @protected
     * @param {Object} data - Template data
     * @return {boolean} - True if data can be rendered
     */
    _validate( data ) {
        if ( this.debug ) this.debug.warn( data );
        throw new UiTemplateException( 'Template requires a validate method' );
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
     * @param {Object} data - Template data
     * @return {void}
     */
    set data( data ) {
        if ( !isPojo( data ) ) throw new UiTemplateException( 'Cannot set invalid template data, must be a plain object' );
        this.#data = data;
    }

    /**
     * Render template
     * @public
     * @param {null|Object} data - Template data
     * @return {string} - Rendered template
     */
    render( data = null ) {
        if ( !isPojo( this._defaults ) ) throw new UiTemplateException( 'Invalid template defaults data' );
        if ( data ) this.data = data;
        if ( !isPojo( this.#data ) ) throw new UiTemplateException( 'Invalid template data, must be a plain object' );
        const compiled = {};
        mergeObject( compiled, this._defaults, true, true );
        mergeObject( compiled, this.#data, false, true );
        this._validate( compiled );
        if ( this.debug ) this.debug.log( this.constructor.name + '::render', compiled );
        this._render( compiled );
    }

    /**
     * Render as node
     * @public
     * @param {null|Object} data - Template data
     * @return {NodeList|Array} - Rendered nodes or empty array
     */
    asNode( data = null ) {
        const rendered = this.render( data );
        if ( rendered ) return str2node( rendered );
        return [];
    }

    /**
     * Append rendered template
     * @public
     * @param {HTMLElement} to - Element to append to
     * @param {null|Object} data - Template data
     * @return {void}
     */
    append( to, data = null ) {
        if ( !( to instanceof HTMLElement ) ) throw new UiTemplateException( 'Requires a HTMLElement to append to' );
        const nodes = this.asNode( data );
        for ( let i = 0; i < nodes.length; i++ ) {
            to.appendChild( nodes[ i ] );
        }
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
            if ( this.debug ) this.debug.error( e );
            rendered = this.errorMessage;
        }
        if ( typeof rendered !== 'string' ) {
            rendered = `<!-- render error: ${this.constructor.name} with: ${JSON.stringify( this.#data )} -->`;
        }
        return rendered;
    }
}
