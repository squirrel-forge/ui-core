/**
 * Requires
 */
import { Exception, Plugin, isPojo } from '@squirrel-forge/ui-util';

/**
 * UiPlugin exception
 * @class
 */
class UiPluginException extends Exception {}

/**
 * UiPlugin class
 * @abstract
 * @class
 */
export class UiPlugin extends Plugin {

    /**
     * Extend context config
     * @public
     * @property
     * @type {null|Object}
     */
    extendConfig = null;

    /**
     * Extend states
     * @public
     * @property
     * @type {null|Object}
     */
    extendStates = null;

    /**
     * Register dom events
     * @public
     * @property
     * @type {null|Array}
     */
    registerEvents = null;

    /**
     * Apply scoped config
     * @public
     * @property
     * @type {boolean}
     */
    configOptions = true;

    /**
     * Component init state
     * @private
     * @property
     * @type {boolean}
     */
    #initComplete = false;

    /**
     * Constructor
     * @constructor
     * @param {Object} options - Options object
     * @param {Object|UiComponent} context - UiPlugin context
     * @param {null|console|Object} debug - Debug object
     */
    constructor( options = {}, context = null, debug = null ) {
        super( options, context, debug );
    }

    /**
     * Extend components default config
     *  Is run during construction, some things might not be available yet
     * @public
     * @param {Array<Object>} extend - Extension register
     * @param {Object|UiComponent} context - UiPlugin context
     * @return {void}
     */
    extendDefaultConfig( extend, context ) {
        this._context_check( context );

        // Extend config defaults
        if ( this.extendConfig ) {
            if ( !isPojo( this.extendConfig ) ) {
                throw new UiPluginException( 'Config extension, must be a plain Object' );
            }
            if ( !Object.keys( this.extendConfig ).length ) {
                throw new UiPluginException( 'Config extension is empty' );
            }
            extend.push( this.extendConfig );
        }
    }

    /**
     * Extend available component states
     *  Is run during construction, some things might not be available yet
     * @public
     * @param {Object|ComponentStates} states - Component states object
     * @param {Object|UiComponent} context - UiPlugin context
     * @return {void}
     */
    extendAvailableStates( states, context ) {
        this._context_check( context );

        // Extend component states
        if ( this.extendStates ) {
            if ( !isPojo( this.extendConfig ) ) {
                throw new UiPluginException( 'States extension, must be a plain Object' );
            }
            if ( !Object.keys( this.extendConfig ).length ) {
                throw new UiPluginException( 'States extension is empty' );
            }
            states.extend( this.extendStates );
        }
    }

    /**
     * Apply plugin scoped config to component
     * @param {Config|Object} config - Context config object
     * @param {UiComponent|Object} context - Plugin context
     */
    applyConfig( config, context ) {
        this._context_check( context );

        // Apply scoped config
        if ( this.configOptions ) {
            if ( isPojo( this.options ) ) {
                const scope = this.constructor.pluginName || this.constructor.name;
                const scoped = {};
                scoped[ scope ] = this.options;
                config.merge( scoped );
            } else if ( this.debug ) {
                this.debug.error( this.constructor.name + '::applyConfig Invalid options type:', typeof this.options );
            }
        }
    }

    /**
     * Init component
     *  Is run during construction, some things might not be available yet
     * @public
     * @param {Object|UiComponent} context - UiPlugin context
     * @return {void}
     */
    initComponent( context ) {
        if ( this.#initComplete ) {
            throw new UiPluginException( 'Plugin already initialized: ' + this.constructor.name );
        }
        this.#initComplete = true;
        this._context_check( context );

        // Register dom event listeners
        if ( this.registerEvents ) {
            if ( !( this.registerEvents instanceof Array ) ) {
                throw new UiPluginException( 'Event register must be an Array' );
            }
            context.addEventList( this.registerEvents );
        }
    }
}
