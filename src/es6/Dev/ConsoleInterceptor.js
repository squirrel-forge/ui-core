/**
 * Requires
 */
import { EventDispatcher } from '../Events/EventDispatcher.js';

/**
 * Console interceptor
 * @class
 */
export class ConsoleInterceptor extends EventDispatcher {

    /**
     * Native logging
     * @private
     * @property
     * @type {boolean|Array<string>}
     */
    #native = true;

    /**
     * Fire events
     * @private
     * @property
     * @type {boolean|Array<string>}
     */
    #events = false;

    /**
     * Native console reference
     * @private
     * @property
     * @type {null|console}
     */
    #console = null;

    /**
     * Constructor
     * @constructor
     * @param {null|document|HTMLElement} host - Event host
     * @param {boolean} global - Replace window.console
     */
    constructor( host = null, global = true ) {
        super( host || document );

        // Setup interceptor
        this.#console = window.console;
        this.#init( this.#console );

        // Replace global console
        if ( global === true ) {
            window.console = this;
        }
    }

    /**
     * Native console getter
     * @public
     * @return {null|console} - Native console
     */
    get console() {
        return this.#console;
    }

    /**
     * Native mode getter
     * @public
     * @return {boolean|Array<string>} - Native mode
     */
    get native() {
        return this.#native;
    }

    /**
     * Native mode setter
     * @public
     * @param {boolean|Array<string>} value - Native mode
     */
    set native( value ) {
        this.#native = value instanceof Array ? value : !!value;
    }

    /**
     * Fire events getter
     * @public
     * @return {boolean|Array<string>} - Events mode
     */
    get events() {
        return this.#events;
    }

    /**
     * Fire events setter
     * @public
     * @param {boolean|Array<string>} value - Events mode
     */
    set events( value ) {
        this.#events = value instanceof Array ? value : !!value;
    }

    /**
     * Initialize
     * @private
     * @param {console} console - Native console
     * @return {void}
     */
    #init( console ) {

        // Get available console methods
        const methods = Object.getOwnPropertyNames( console )
            .filter( ( name ) => {
                return typeof console[ name ] === 'function';
            } );

        // Create local propagation methods
        for ( let i = 0; i < methods.length; i++ ) {
            const method = methods[ i ];
            this[ method ] = ( ...args ) => {

                // Propagate to native methods
                if ( this.#native === true || this.#native instanceof Array && this.#native.includes( method )  ) {
                    console[ method ]( ...args );
                }

                // Propagate to event
                if ( this.#events === true || this.#events instanceof Array && this.#events.includes( method )  ) {
                    this.dispatchEvent( 'debug.' + method, { args, console } );
                }
            };
        }
    }
}
