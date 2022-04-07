/**
 * Requires
 */
import { Exception } from '../Error/Exception.js';
import { isPojo } from '../Object/isPojo.js';
import { mergeObject } from '../Object/mergeObject.js';
import { cloneObject } from '../Object/cloneObject.js';
import { strCreate } from '../Object/strCreate.js';
import { strAccess } from '../Object/strAccess.js';

/**
 * Config exception
 * @class
 */
class ConfigException extends Exception {}

/**
 * Config
 * TODO: add option change callback/event in some form
 * @class
 */
export class Config {

    /**
     * Config defaults
     * @private
     * @property
     * @type {Object}
     */
    #defaults = {};

    /**
     * Config data
     * @private
     * @property
     * @type {Object}
     */
    #data = {};

    /**
     * Constructor
     * @constructor
     * @param {Object} defaults - Default config values object
     * @param {Array<Object>} extended - Default config extension array for inheritance
     */
    constructor( defaults = {}, extended = [] ) {

        // Check defaults
        if ( !isPojo( defaults ) ) {
            throw new ConfigException( 'Argument defaults must be a plain Object' );
        }
        this.#defaults = defaults;

        // Check extended
        if ( !( extended instanceof Array ) ) {
            throw new ConfigException( 'Argument extended must be an Array' );
        }

        // Update default config with extensions
        for ( let i = 0; i < extended.length; i++ ) {
            if ( !isPojo( extended[ i ] ) ) {
                throw new ConfigException( 'Argument extended must contain only plain Objects' );
            }
            this.constructor.merge( extended[ i ], this.#defaults, true );
        }

        // Setup active config data
        this.#data = this.constructor.clone( this.#defaults );
    }

    /**
     * Clone object recursive
     * @param {Object} data - Data to clone
     * @return {Object|Array} - Cloned object
     */
    static clone( data ) {
        return cloneObject( data, true );
    }

    /**
     * Merge object recursive
     * @param {Object} data - Data to merge
     * @param {Object} target - Target to merge to
     * @param {boolean} extend -  Set true to add undefined|null properties
     * @return {void}
     */
    static merge( data, target, extend = false ) {
        mergeObject( target, data, extend, true, true );
    }

    /**
     * Defaults getter
     * @return {Object} - Defaults data object
     */
    get defaults() {
        return this.constructor.clone( this.#defaults );
    }

    /**
     * Data getter
     * @return {Object} - Config data object
     */
    get data() {
        return this.constructor.clone( this.#data );
    }

    /**
     * Direct config access
     * @return {Object} - Config data object
     */
    get exposed() {
        return this.#data;
    }

    /**
     * Get config value
     * @param {string} name - Value name
     * @return {*|null} - Config value
     */
    get( name ) {
        return strAccess( name, this.#data );
    }

    /**
     * Set config value
     * @param {string} name - Value name
     * @param {*} value - Value to set
     * @return {void}
     */
    set( name, value ) {
        strCreate( name, value, this.#data, true );
    }

    /**
     * Merge data into config
     * @param {Object} data - Data object to merge
     * @param {boolean} extend -  Set true to add undefined|null properties
     * @return {void}
     */
    merge( data, extend = false ) {
        if ( !isPojo( data ) ) {
            throw new ConfigException( 'Argument data must be a plain Object' );
        }
        this.constructor.merge( data, this.#data, extend );
    }
}
