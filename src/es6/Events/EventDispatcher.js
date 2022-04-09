/**
 * Requires
 */
import { Exception } from '../Error/Exception.js';
import { cloneObject } from '../Object/cloneObject.js';
import { isPojo } from '../Object/isPojo.js';

/**
 * Event dispatcher exception
 * @class
 */
class EventDispatcherException extends Exception {}

/**
 * Event dispatcher
 * @class
 */
export class EventDispatcher {

    /**
     * Debug object
     * @private
     * @property
     * @type {null|console|Object}
     */
    #debug = null;

    /**
     * Event target
     * @private
     * @type {null|HTMLElement|EventDispatcher}
     */
    #target = null;

    /**
     * Parent if no target is set
     * @private
     * @type {null|HTMLElement|EventDispatcher}
     */
    #parent = null;

    /**
     * Simulated events handlers map
     * @private
     * @type {Object}
     */
    #simulated = {};

    /**
     * Constructor
     * @constructor
     * @param {null|HTMLElement|Object} element - The target element
     * @param {null|EventDispatcher} parent - Parent event dispatcher, only used for simulated events
     * @param {null|console} debug - Console or alike object to show debugging
     */
    constructor( element = null, parent = null, debug = null ) {

        // Require element or null
        if ( !( element === null || element instanceof HTMLElement ) ) {
            throw new EventDispatcherException( 'Argument element must be null or an instance of HTMLElement' );
        }

        // Debugger instance
        this.#debug = debug;

        // Element reference
        this.#target = element;
        this.#parent = parent;

        // Construction info
        if ( this.#debug ) {
            this.#debug.log( this.constructor.name + '::constructed', this );
        }
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
     * Target getter
     * @public
     * @return {null|HTMLElement|EventDispatcher} - Target reference
     */
    get target() {
        return this.#target;
    }

    /**
     * Parent getter
     * @public
     * @return {null|HTMLElement|EventDispatcher} - Parent reference
     */
    get parent() {
        return this.#parent;
    }

    /**
     * Get event data
     * @private
     * @param {null|Object} data - Data object
     * @return {Object} - Updated data object
     */
    #data( data ) {
        data = data || { target : this };
        if ( !data.target ) data.target = this;
        if ( !data.current ) data.current = this;
        return data;
    }

    /**
     * Run simulated event
     * @private
     * @param {string} name - Event name
     * @param {CustomEvent} event - Custom event
     * @param {Object} data - Event data
     * @return {void}
     */
    #runSimulated( name, event, data ) {
        if ( this.#simulated[ name ] && this.#simulated[ name ].length ) {
            for ( let i = 0; i < this.#simulated[ name ].length; i++ ) {
                this.#simulated[ name ][ i ].apply( this, [ event ] );

                // Remove handler if required
                if ( this.#simulated[ name ][ i ].__EventDispatcherOnce === true ) {
                    this.#simulated[ name ].splice( i, 1 );
                    i--;
                }

                // Break out of execution chain
                // event.stopImmediatePropagation() was called
                if ( event.cancelBubble ) {
                    if ( this.#debug ) {
                        this.#debug.log( this.constructor.name + '::dispatchEvent simulated [ ' + name + ' ] broke after', i );
                    }
                    break;
                }
            }
        }

        // Dispatch to parent
        if ( this.#parent && event.bubbles && !event.cancelBubble ) {

            // Notify bubble
            if ( this.#debug ) {
                this.#debug.log( this.constructor.name + '::dispatchEvent bubble [ ' + name + ' ] to', this.#parent );
            }

            // Bubble event to parent
            const cloned = cloneObject( data );
            cloned.current = this.#parent;
            this.#parent.dispatchEvent( name, cloned );
        }
    }

    /**
     * Dispatch event
     * @public
     * @param {string} name - Event name
     * @param {null|object} data - Event data
     * @param {boolean} bubbles - Allow event to bubble
     * @param {boolean} cancelable - Allow event to be cancelled
     * @return {void}
     */
    dispatchEvent( name, data = null, bubbles = true, cancelable = false ) {
        data = this.#data( data );

        // Debug info
        if ( this.#debug ) {
            this.#debug.groupCollapsed( this.constructor.name + '::dispatchEvent [ ' + name + ' ]' );
            this.#debug.log( 'On', this.#target || this );
            this.#debug.log( 'With', data );
            this.#debug.groupEnd();
        }

        // Create event
        const event = new CustomEvent( name, { bubbles : bubbles, cancelable : cancelable, detail : data } );

        // Simulated event
        if ( this.#target === null ) {
            this.#runSimulated( name, event, data );
        } else {

            // Actual event
            this.#target.dispatchEvent( event );
        }
    }

    /**
     * Add simulated listener
     * @private
     * @param {string} name - Event name
     * @param {Function} callback - Event callback
     * @param {boolean|Object} useCaptureOptions - Capture style or options Object
     * @return {void}
     */
    #addSimulatedListener( name, callback, useCaptureOptions ) {
        if ( !this.#simulated[ name ] ) {
            this.#simulated[ name ] = [];
        }
        this.#simulated[ name ].push( callback );

        // Support for the once option
        if ( isPojo( useCaptureOptions ) && useCaptureOptions.once === true ) {
            this.#simulated[ name ][ this.#simulated[ name ].length - 1 ].__EventDispatcherOnce = true;
        }
    }

    /**
     * Register event listener
     * @public
     * @param {string} name - Event name
     * @param {Function} callback - Callback to register for event
     * @param {boolean|Object} useCaptureOptions - Capture style or options Object
     * @return {void}
     */
    addEventListener( name, callback, useCaptureOptions = false ) {
        if ( !isPojo( useCaptureOptions ) ) {
            useCaptureOptions = {
                once : false,
                capture : useCaptureOptions,
                passive : false,
            };
        }
        if ( typeof callback !== 'function' ) {
            throw new EventDispatcherException( 'Argument callback for event "' + name + '" must be a function' );
        }

        // Simulated event
        if ( this.#target === null ) {
            this.#addSimulatedListener( name, callback, useCaptureOptions );
        } else {

            // Actual event
            this.#target.addEventListener( name, callback, useCaptureOptions );
        }

        // Notify register
        if ( this.#debug ) {
            this.#debug.groupCollapsed( this.constructor.name + '::addEventListener [ ' + name + ' ]' );
            this.#debug.log( 'On', this.#target );
            this.#debug.log( 'With', callback );
            this.#debug.groupEnd();
        }
    }

    /**
     * Remove simulated listener
     * @private
     * @param {string} name - Event name
     * @param {Function} callback - Event callback
     * @return {void}
     */
    #removeSimulatedListener( name, callback ) {
        if ( this.#simulated[ name ] ) {
            for ( let i = 0; i < this.#simulated[ name ].length; i++ ) {
                if ( this.#simulated[ name ][ i ] === callback ) {
                    this.#simulated[ name ].splice( i, 1 );
                }
            }
        }
    }

    /**
     * Remove event listener
     * @public
     * @param {string} name - Event name
     * @param {function} callback - Callback to deregister from event
     * @param {boolean|Object} useCaptureOptions - Capture style or options Object
     * @return {void}
     */
    removeEventListener( name, callback, useCaptureOptions = false ) {

        // Simulated event
        if ( this.#target === null ) {
            this.#removeSimulatedListener( name, callback );
        } else {

            // Actual event
            this.#target.removeEventListener( name, callback, useCaptureOptions );
        }
    }

    /**
     * Register an array of event listeners
     * @public
     * @param {Array<Array>} events - Array of addEventListener argument arrays
     * @return {void}
     */
    addEventList( events ) {
        for ( let i = 0; i < events.length; i++ ) {
            this.addEventListener( ...events[ i ] );
        }
    }
}
