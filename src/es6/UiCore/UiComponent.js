/**
 * Requires
 */
import { Config } from './Config.js';
import { ComponentStates } from './ComponentStates.js';
import { Plugins } from './Plugins.js';
import { EventDispatcher } from '../Events/EventDispatcher.js';
import { attributeJSON } from '../HTML/attributeJSON.js';
import { Exception } from '../Error/Exception.js';
import { strCreate } from '../Object/strCreate.js';
import { isPojo } from '../Object/isPojo.js';
import { requireUniqid } from '../HTML/uniqid.js';

/**
 * Ui component exception
 * @class
 */
class UiComponentException extends Exception {}

/**
 * Ui component
 * @class
 */
export class UiComponent extends EventDispatcher {

    /**
     * Dom reference
     * @private
     * @property
     * @type {null|HTMLElement}
     */
    #dom = null;

    /**
     * Component config
     * @private
     * @property
     * @type {null|Config}
     */
    #config = null;

    /**
     * Component states
     * @private
     * @property
     * @type {null|ComponentStates}
     */
    #states = null;

    /**
     * Component plugins
     * @private
     * @property
     * @type {null|Plugins}
     */
    #plugins = null;

    /**
     * Constructor
     * @constructor
     * @param {HTMLElement} element - Dom element
     * @param {null|Object} settings - Config object
     * @param {Object} defaults - Default config
     * @param {Array<Object>} extend - Config defaults extension for inheritance
     * @param {Object} states - States definition
     * @param {Array<Function|Array<Function,*>>} plugins - Plugins to load
     * @param {boolean} init - Run init method
     * @param {null|console|Object} debug - Debug object
     */
    constructor( element, settings = null, defaults = {}, extend = [], states = {}, plugins = [], init = true, debug = null ) {
        super( element, null, debug );
        if ( !( element instanceof HTMLElement ) ) throw new UiComponentException( 'Argument element must be a HTMLElement' );
        this.#dom = element;
        requireUniqid( element, this.constructor.name.toLowerCase() + '-', true );
        this.#markAsUi();
        this.#plugins = new Plugins( plugins, this, true, debug );
        this.#plugins.run( 'extendDefaultConfig', [ extend ] );
        this.#config = new Config( defaults, extend );
        this.#loadElementConfig();
        this.#setConfigFromAttributes();
        if ( isPojo( settings ) ) this.config.merge( settings );
        this.#states = new ComponentStates( this, states );
        this.#plugins.run( 'extendAvailableStates', [ this.#states ] );
        if ( init ) this.init();
    }

    /**
     * Dom getter
     * @public
     * @return {HTMLElement} - Component dom element
     */
    get dom() {
        return this.#dom;
    }

    /**
     * Config getter
     * @public
     * @return {Config} - Component config
     */
    get config() {
        return this.#config;
    }

    /**
     * States getter
     * @public
     * @return {ComponentStates} - Component states
     */
    get states() {
        return this.#states;
    }

    /**
     * Plugins getter
     * @public
     * @return {Plugins} - Component plugins
     */
    get plugins() {
        return this.#plugins;
    }

    /**
     * Load and merge element config
     * @private
     * @return {void}
     */
    #loadElementConfig() {
        const config = attributeJSON( 'data-config', this.#dom );
        if ( config ) {
            this.config.merge( config );
            if ( this.debug ) this.debug.log( this.constructor.name + '::loadElementConfig', config );
        }
    }

    /**
     * Mark as ui component
     * @protected
     * @return {void}
     */
    #markAsUi() {
        this.#dom.setAttribute( 'data-ui', this.constructor.name );
    }

    /**
     * Initialize component
     * @return {void}
     */
    init() {
        this.#plugins.run( 'initComponent' );
        this.#states.set( 'initialized' );

        // Delay the init dispatch for object availability reasons
        window.setTimeout( () => {
            this.dispatchEvent( 'initialized' );
        }, 1 );
    }

    /**
     * Convert attribute name to config
     * @public
     * @param {string} name - Attribute name
     * @return {string} - Config name
     */
    static configNameFromAttr( name ) {
        name = name.replace( /-/g, '.' );
        if ( name.substr( 0, 5 ) === 'data.' ) {
            name = name.substr( 5 );
        }
        return name;
    }

    /**
     * Convert attribute value to config value
     * @public
     * @param {null|string} value - Attribute value
     * @return {*} - Converted value
     */
    static configValueFromAttr( value ) {
        if ( typeof value === 'string' ) {
            if ( value.length ) {
                if ( value.toLowerCase() === 'true' ) {
                    value = true;
                } else if ( value.toLowerCase() === 'false' ) {
                    value = false;
                } else if ( value[ 0 ] === '[' || value[ 0 ] === '{' ) {
                    try {
                        value = JSON.parse( value );
                    } catch ( error ) {
                        return value;
                    }
                }
            } else {
                value = true;
            }
        }
        return value;
    }

    /**
     * Get config from attributes
     * @public
     * @return {null|Object} - Config object
     */
    getConfigFromAttributes() {
        if ( this.#dom.hasAttributes() ) {
            const result = {};
            const attrs = this.#dom.attributes;
            for ( let i = 0; i < attrs.length; i++ ) {
                const name = this.constructor.configNameFromAttr( attrs[ i ].name );
                const value = this.constructor.configValueFromAttr( attrs[ i ].value );
                strCreate( name, value, result, true, true, this.debug );
            }
            return result;
        }
        return null;
    }

    /**
     * Set config from attributes
     * @private
     * @return {void}
     */
    #setConfigFromAttributes() {
        const result = this.getConfigFromAttributes();
        if ( result ) {
            this.config.merge( result );
            if ( this.debug ) this.debug.log( this.constructor.name + '::getConfigFromAttributes', result );
        }
    }

    /**
     * Get dom references from config
     * @public
     * @param {string} name - Reference name
     * @param {boolean} multiple - Set false to return one element
     * @return {null|HTMLElement|NodeList} - Dom reference/s
     */
    getDomRefs( name, multiple = true ) {
        const ref = this.config.get( 'dom.' + name );
        if ( !name || !name.length || !ref ) {
            return null;
        }
        const method = 'querySelector' + ( multiple ? 'All' : '' );
        return this.#dom[ method ]( ref );
    }

    /**
     * Set state from event
     * @param {Event} event - Event object
     * @return {void}
     */
    event_state( event ) {
        if ( !event || typeof event.type !== 'string' || !event.type.length ) {
            throw new UiComponentException( 'No valid event type available' );
        }
        this.states.set( event.type );
    }
}
