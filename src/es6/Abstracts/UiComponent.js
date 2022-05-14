/**
 * Requires
 */
import { ComponentStates } from '../States/ComponentStates.js';
import {
    Exception,
    EventDispatcher,
    Config,
    Plugins,
    attributeJSON,
    requireUniqid,
    strCreate,
    isPojo
} from '@squirrel-forge/ui-util';

// Import for local dev
// } from '../../../../ui-util';

/**
 * Ui component exception
 * @class
 */
class UiComponentException extends Exception {}

/**
 * Ui component
 * @abstract
 * @class
 */
export class UiComponent extends EventDispatcher {

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
     * Convert attribute name to config dot path
     * @public
     * @param {string} name - Attribute name
     * @return {string} - Config name
     */
    static configDotNameFromAttr( name ) {
        name = name.replace( /-/g, '.' );
        if ( name.substr( 0, 5 ) === 'data.' ) {
            name = name.substr( 5 );
        }
        return name;
    }

    /**
     * Convert config dot path to camel case
     * @public
     * @param {string} name - Dot path
     * @return {string} - Camel case
     */
    static configCamelNameFromDot( name ) {
        return name.toLowerCase().replace( /\.(.)/g, ( m, g ) => { return g.toUpperCase(); } );
    }

    /**
     * Make ui component
     * @param {HTMLElement} element - Element
     * @param {null|Object} settings - Config object
     * @param {null|Array} plugins - Plugins array
     * @param {null|EventDispatcher|HTMLElement} parent - Parent object
     * @param {null|false|console|Object} debug - Debug object
     * @param {Function} Construct - Component constructor
     * @return {UiComponent} - Component object
     */
    static make(
        element,
        settings = null,
        plugins = null,
        parent = null,
        debug = null,
        Construct = null
    ) {
        if ( !( element instanceof HTMLElement ) ) {
            throw new UiComponentException( 'Argument element must be a HTMLElement' );
        }
        Construct = Construct || this;
        if ( debug === null ) {
            const value = element.getAttribute( 'debug' ) || element.getAttribute( 'data-debug' );
            if ( Construct.configValueFromAttr( value ) === true ) {
                debug = console;
            }
        } else if ( debug === true ) {
            debug = console;
        }
        if ( debug ) window.console.warn( 'UiComponent.make', this.name, { element, settings, plugins, parent, debug, Construct } );
        return new Construct( element, settings, null, null, null, plugins, parent, debug, true );
    }

    /**
     * Initialize all ui elements in context
     * @param {null|Object} settings - Config object
     * @param {null|Array} plugins - Plugins array
     * @param {null|EventDispatcher|HTMLElement} parent - Parent object
     * @param {document|HTMLElement} context - Context to initialize
     * @param {null|console|Object} debug - Debug object
     * @param {Function} Construct - Component constructor
     * @return {Array<UiComponent>} - Initialized components
     */
    static makeAll(
        settings = null,
        plugins = null,
        parent = null,
        context = document,
        debug = null,
        Construct = null
    ) {
        Construct = Construct || this;
        if ( debug ) window.console.warn( 'UiComponent.makeAll', this.name, { settings, plugins, parent,  context, debug, Construct } );
        const result = [];
        const elements = context.querySelectorAll( Construct.selector );
        for ( let i = 0; i < elements.length; i++ ) {
            result.push( Construct.make( elements[ i ], settings, plugins, parent, debug, Construct ) );
        }
        return result;
    }

    /**
     * Element selector getter
     * @public
     * @return {string} - Element selector
     */
    static get selector() {
        return '[is="ui-component"]:not([data-state])';
    }

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
     * Initialized
     * @private
     * @property
     * @type {boolean}
     */
    #initialized = false;

    /**
     * Component children
     * @private
     * @property
     * @type {Array}
     */
    #children = [];

    /**
     * Children initialized
     * @private
     * @property
     * @type {boolean}
     */
    #children_initialized = false;

    /**
     * Constructor
     * @constructor
     * @param {HTMLElement} element - Dom element
     * @param {null|Object} settings - Config object
     * @param {Object} defaults - Default config
     * @param {Array<Object>} extend - Config defaults extension for inheritance
     * @param {Object} states - States definition
     * @param {Array<Function|Array<Function,*>>} plugins - Plugins to load
     * @param {null|EventDispatcher|HTMLElement} parent - Parent object
     * @param {null|console|Object} debug - Debug object
     * @param {boolean} init - Run init method
     */
    constructor(
        element,
        settings = null,
        defaults = null,
        extend = null,
        states = null,
        plugins = null,
        parent = null,
        debug = null,
        init = true
    ) {
        super( element, parent, debug );
        if ( debug ) window.console.warn( 'UiComponent.constructor >', this.constructor.name, {
            element, settings, defaults, extend, states, plugins, parent, debug, init
        } );
        if ( !( element instanceof HTMLElement ) ) throw new UiComponentException( 'Argument element must be a HTMLElement' );
        this.#dom = element;

        // Require element id and mark as ui-component
        requireUniqid( element, this.constructor.name.toLowerCase() + '-', true );
        this.#markAsUi();

        // Initialize plugins and extend defaults
        extend = extend || [];
        this.#plugins = plugins ? new Plugins( plugins, this, true, debug ) : null;
        this.#plugins?.run( 'extendDefaultConfig', [ extend ] );

        // Create component config
        this.#config = new Config( defaults || {}, extend );

        // Set config options from attributes
        this.#setConfigFromAttributes();

        // Ensure the config property overrides any attributes
        this.#loadElementConfig();

        // Apply any plugin scoped configs
        this.#plugins?.run( 'applyConfig', [ this.config ] );

        // Apply settings explicitly provided by constructor arguments
        if ( isPojo( settings ) ) this.config.merge( settings );

        // Create states handler and extend with any plugin states
        this.#states = new ComponentStates( this, states || {} );
        this.#plugins?.run( 'extendAvailableStates', [ this.#states ] );

        // Initialize component
        if ( init ) this.init();
    }

    /**
     * Type getter
     * @public
     * @return {string} - Component type
     */
    get type() {
        return this.constructor.name;
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
     * Children getter
     * @public
     * @return {Array} - Component children
     */
    get children() {
        return [ ...this.#children ];
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
     * @private
     * @return {void}
     */
    #markAsUi() {
        this.#dom.setAttribute( 'data-ui', this.constructor.name );
    }

    /**
     * Initialize component
     * @public
     * @return {void}
     */
    init() {
        if ( this.#initialized ) {
            throw new UiComponentException( 'Component already initialized' );
        }
        this.#initialized = true;
        this.#plugins?.run( 'initComponent' );
        this.#states.set( 'initialized' );

        // Delay the init dispatch and children for object availability reasons
        window.setTimeout( () => {
            this.dispatchEvent( 'initialized' );
        }, 1 );
    }

    /**
     * Initialize child components
     * @protected
     * @return {void}
     */
    _initChildren() {
        if ( this.#children_initialized ) {
            throw new UiComponentException( 'Component children already initialized' );
        }
        this.#children_initialized = true;
        const options = this.#config.get( 'children' );
        if ( options && isPojo( options ) ) {
            const types = Object.entries( options );
            if ( types.length && this.debug ) this.debug.group( this.constructor.name + '::_initChildren', types );
            for ( let i = 0; i < types.length; i++ ) {

                // Build arguments
                const [ name, Construct ] = types[ i ];
                const params = Construct instanceof Array ? Construct : [ Construct ];

                // Attempt to initialize each type
                try {
                    this.#children = this.#children.concat( this.#initChildType( ...params ) );
                } catch ( e ) {
                    throw new UiComponentException( 'Failed to initialize child type: ' + name, e );
                }
            }
            if ( types.length && this.debug ) this.debug.groupEnd();
            this.dispatchEvent( 'children.initialized' );
        }
    }

    /**
     * Initialize children by type
     * @private
     * @param {Function|UiComponent} Construct - Component constructor
     * @param {null|Object} settings - Config object
     * @param {Array} plugins - Plugins
     * @return {Array<UiComponent>} - Initialized components
     */
    #initChildType( Construct, settings = null, plugins = null ) {
        if ( typeof Construct !== 'function' ) {
            throw new UiComponentException( 'Argument Construct must be a Function' );
        }
        return Construct.makeAll( settings, plugins, this, this.#dom, this.debug, Construct );
    }

    /**
     * Cycle children
     * @param {string|Array|Function} filter - Filter or callback function
     * @param {null|Function} callback - Callback when using a filter
     * @return {void}
     */
    eachChild( filter, callback = null ) {
        if ( typeof filter === 'function' ) {
            callback = filter;
            filter = null;
        } else if ( typeof callback !== 'function' ) {
            throw new UiComponentException( 'Argument callback must be a Function' );
        }
        let x = 0;
        for ( let i = 0; i < this.#children.length; i++ ) {
            const child = this.#children[ i ];
            if ( !filter || filter === child.type || filter instanceof Array && filter.includes( child.type ) ) {
                const br = callback( child, x, i );
                if ( br === true ) break;
                x++;
            }
        }
    }

    /**
     * Get config from attributes
     * @public
     * @param {Array<string>} disregard - Disregard options names
     * @return {null|Object} - Config object
     */
    getConfigFromAttributes( disregard = [ 'id', 'class', 'type', 'state', 'config' ] ) {
        if ( this.#dom.hasAttributes() ) {
            const result = {};
            const attrs = this.#dom.attributes;
            for ( let i = 0; i < attrs.length; i++ ) {
                const name = this.constructor.configDotNameFromAttr( attrs[ i ].name );
                const value = this.constructor.configValueFromAttr( attrs[ i ].value );
                if ( !disregard.includes( name ) ) {
                    strCreate( name, value, result, true, true, this.debug );
                }
                const camel = this.constructor.configCamelNameFromDot( name );
                if ( !disregard.includes( camel ) ) {
                    strCreate( camel, value, result, true, true, this.debug );
                }
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
     * @public
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
