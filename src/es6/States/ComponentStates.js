/**
 * Requires
 */
import { Exception, isPojo, mergeObject } from '@squirrel-forge/ui-util';

/**
 * Component states exception
 * @class
 */
class ComponentStatesException extends Exception {}

/**
 * @typedef {Object|true} ComponentStateDefinition - Component state definition
 * @property {undefined|null|boolean} global - By default state is global, set to: false for non global states
 * @property {undefined|null|string} classOn - CSS class to set when active
 * @property {undefined|null|string} classOff - CSS class to set when inactive
 * @property {undefined|null|Array<string>} unsets - Unset given states when this one becomes active
 */

/**
 * Component states
 * @class
 */
export class ComponentStates {

    /**
     * Component element
     * @private
     * @property
     * @type {null}
     */
    #component = null;

    /**
     * Component states
     * @private
     * @property
     * @type {null}
     */
    #states = null;

    /**
     * States by name
     * @private
     * @property
     * @type {Object}
     */
    #named = {};

    /**
     * Global state
     * @private
     * @property
     * @type {null|string}
     */
    #global = null;

    /**
     * Global state attribute
     * @private
     * @property
     * @type {string}
     */
    #attribute = 'data-state';

    /**
     * Constructor
     * @constructor
     * @param {UiComponent} component - Component element
     * @param {null|Object} states - States map
     */
    constructor( component, states = null ) {
        this.#component = component;
        if ( states !== null && !isPojo( states ) ) {
            throw new ComponentStatesException( 'Argument states must be null or a plain Object' );
        } else if ( states === null ) {
            states = { initialized : { classOn : 'initialized' } };
        }
        this.#states = states;
    }

    /**
     * Global state getter
     * @public
     * @return {null|string} - Global state
     */
    get global() {
        return this.#global;
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
     * @return {boolean} - State is active
     */
    is( name ) {
        return !!this.#named[ name ];
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
        if ( !state ) throw new ComponentStatesException( 'Unknown state: ' + name );
        return state;
    }

    /**
     * Set state by name
     * @public
     * @param {string} name - State name
     * @return {void}
     */
    set( name ) {
        const state = this.get( name );
        const is_global = state === true || state.global !== false;
        let is_global_changed = false, to = null;
        const from = this.#global;
        if ( is_global ) {

            // Do not set globals unless changed
            if ( name !== from ) {
                is_global_changed = true;
                to = name;
            } else {

                // Skip along and ignore the set command
                return;
            }
        }

        // Complex state options
        if ( state !== true ) {

            // Unset any states
            if ( state.unsets instanceof Array ) {
                for ( let i = 0; i < state.unsets.length; i++ ) {
                    this.unset( state.unsets[ i ] );
                }
            }

            // Set/unset any class states
            if ( state.classOn ) this.#component.dom.classList.add( state.classOn );
            if ( state.classOff ) this.#component.dom.classList.remove( state.classOff );
        }

        // Default and global states are both global
        if ( is_global ) {
            this.#component.dom.setAttribute( this.#attribute, name );
            this.#global = name;
        }

        // Set individual state
        this.#named[ name ] = true;

        // Dispatch corresponding event
        if ( is_global_changed ) {
            this.#component.dispatchEvent( 'state.changed', { from, to } );
        } else {
            this.#component.dispatchEvent( 'state.set', { set : name } );
        }
    }

    /**
     * Set state by name
     * @public
     * @param {string} name - State name
     * @return {void}
     */
    unset( name ) {
        if ( !this.#named[ name ] ) return;
        const state = this.get( name );
        const is_global = state === true || state.global !== false;

        // Complex state options
        if ( state !== true ) {

            // Set/unset any class states
            if ( state.classOn ) this.#component.dom.classList.remove( state.classOn );
            if ( state.classOff ) this.#component.dom.classList.add( state.classOff );
        }

        // Default and global states are both global
        if ( is_global ) {
            this.#component.dom.setAttribute( this.#attribute, 'null' );
            this.#global = null;
        }

        // Set individual state
        this.#named[ name ] = false;
        this.#component.dispatchEvent( 'state.unset', { unset : name } );
    }
}
