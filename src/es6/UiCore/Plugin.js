/**
 * Requires
 */
import { Exception } from '../Error/Exception.js';

/**
 * Plugin exception
 * @class
 */
class PluginException extends Exception {}

/**
 * Plugin class
 * @abstract
 * @class
 */
export class Plugin {

    /**
     * Debug object
     * @private
     * @property
     * @type {null|console|Object}
     */
    #debug = null;

    /**
     * Plugin context
     * @private
     * @property
     * @type {null|Object}
     */
    #context = null;

    /**
     * Plugin options
     * @public
     * @property
     * @type {Object}
     */
    options = null;

    /**
     * Constructor
     * @constructor
     * @param {Object} options - Options object
     * @param {Object} context - Plugin context
     * @param {null|console|Object} debug - Debug object
     */
    constructor( options = {}, context = null, debug = null ) {
        this.#debug = debug;
        this.#context = context;
        this.options = options;
    }

    /**
     * Debug getter
     * @public
     * @return {null|console|Object} - Debug reference
     */
    get debug() {
        return this.#debug;
    }

    /**
     * Context getter
     * @public
     * @return {null|Object} - Parent reference
     */
    get context() {
        return this.#context;
    }

    /**
     * Check context
     * @protected
     * @param {Object} context - Plugin context
     * @return {void}
     */
    _context_check( context ) {
        if ( context && this.#context && context !== this.#context ) {
            throw new PluginException( 'Context mismatch' );
        }
    }
}
