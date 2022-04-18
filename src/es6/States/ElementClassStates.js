/**
 * Requires
 */
import { Exception, isPojo, mergeObject, requireUniqid } from '@squirrel-forge/ui-util';

/**
 * Element class states exception
 * @class
 */
class ElementClassStatesException extends Exception {}

/**
 * @typedef {Object|true} ElementClassStateDefinition - Component state definition
 * @property {undefined|null|string} classOn - CSS class to set when active
 * @property {undefined|null|Array<string>} unsets - Unset given states when this one becomes active
 */

/**
 * Element class states
 * @class
 */
export class ElementClassStates {

    /**
     * Class states
     * @private
     * @property
     * @type {null|Object}
     */
    #states = null;

    /**
     * Auto unset reference data
     * @private
     * @property
     * @type {Object}
     */
    #autoUnsetRefs = {};

    /**
     * Default timeout delay
     * @private
     * @property
     * @type {number}
     */
    #defaultTimeout = 600;

    /**
     * Constructor
     * @constructor
     * @param {null|Object} states - States map
     */
    constructor( states = null ) {
        if ( !isPojo( states ) ) {
            throw new ElementClassStatesException( 'Argument states must be null or a plain Object' );
        }
        this.#states = states;
    }

    /**
     * Direct states access
     * @public
     * @return {Object} - States data object
     */
    get exposed() {
        return this.#states;
    }

    /**
     * Extend states
     * @public
     * @param {Object} states - States map
     * @return {void}
     */
    extend( states ) {
        mergeObject( this.#states, states, true, true, true, false );
    }

    /**
     * State active
     * @public
     * @param {string} name - State name
     * @param {HTMLElement} element - Element target
     * @return {boolean} - State is active
     */
    is( name, element ) {
        const state = this.get( name );
        if ( state.classOn ) {
            return element.classList.contains( state.classOn );
        }
        return false;
    }

    /**
     * State defined
     * @public
     * @param {string} name - State name
     * @return {boolean} - State exists
     */
    has( name ) {
        return !!this.#states[ name ];
    }

    /**
     * Get state info
     * @public
     * @param {string} name - State name
     * @return {Object} - State info object
     */
    get( name ) {
        const state = this.#states[ name ];
        if ( !state ) throw new ElementClassStatesException( 'Unknown state: ' + name );
        return state;
    }

    /**
     * Set state by name
     * @public
     * @param {string} name - State name
     * @param {HTMLElement} element - Element target
     * @return {void}
     */
    set( name, element ) {
        const state = this.get( name );

        // Unset states
        if ( state.unsets instanceof Array ) {
            for ( let i = 0; i < state.unsets.length; i++ ) {
                this.unset( state.unsets[ i ], element );
            }
        }

        // Set state class
        if ( state.classOn ) element.classList.add( state.classOn );

        // Callback on
        if ( state.callbackOn ) state.callbackOn( name, element, state );

        // Automatic unset
        if ( state.autoUnset ) {

            // Get or create unique element id
            const state_unset_id = requireUniqid( element, 'ecs-', true ) + '-' + name;

            // Clear any existing timeout
            this.#clear_auto_unset( state_unset_id );

            // Setup new timeout for remove
            const timeout = typeof state.autoUnset === 'number' ? state.autoUnset : this.#defaultTimeout;
            this.#autoUnsetRefs[ state_unset_id ] = window.setTimeout( () => {

                // Clear and unset state if reached
                this.#clear_auto_unset( state_unset_id );
                this.unset( name, element );
            }, timeout );
        }
    }

    /**
     * Clear auto unset timeout
     * @param {string} id - Element id
     * @return {void}
     */
    #clear_auto_unset( id ) {
        if ( this.#autoUnsetRefs[ id ] ) {
            window.clearTimeout( this.#autoUnsetRefs[ id ] );
            this.#autoUnsetRefs[ id ] = null;
        }
    }

    /**
     * Set state by name
     * @public
     * @param {string} name - State name
     * @param {HTMLElement} element - Element target
     * @return {void}
     */
    unset( name, element ) {
        const state = this.get( name );

        // Complex state options
        if ( state.classOn ) element.classList.remove( state.classOn );

        // Callback off
        if ( state.callbackOff ) state.callbackOff( name, element, state );
    }
}
