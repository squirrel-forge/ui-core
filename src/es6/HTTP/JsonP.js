/**
 * Requires
 */
import { strand } from '../String/strand.js';

/**
 * @callback JsonPCallback
 * @param {Object} response - Response data
 * @return {void}
 */

/**
 * @callback JsonPTimeoutCallback
 * @return {void}
 */

/**
 * JsonP
 * @class
 */
export class JsonP {

    /**
     * Script element
     * @private
     * @property
     * @type {null|HTMLScriptElement}
     */
    #script = null;

    /**
     * Timeout reference
     * @private
     * @property
     * @type {null|number}
     */
    #timeout = null;

    /**
     * Callback name
     * @private
     * @property
     * @type {null|string}
     */
    #callback = null;

    /**
     * Timeout limit
     * @private
     * @property
     * @type {null|number}
     */
    #limit = null;

    /**
     * Success callback
     * @private
     * @property
     * @type {null|Function}
     */
    #callback_success = null;

    /**
     * Timeout callback
     * @private
     * @property
     * @type {null|Function}
     */
    #callback_timeout = null;

    /**
     * Generate a callback name
     * @param {string} prefix - Name prefix
     * @return {string} - Unique name in window
     */
    static getCallbackName( prefix = 'jsonPCallback_' ) {
        let id;
        do {
            id = prefix + strand();
        } while ( typeof window[ id ] !== 'undefined' );
        return id;
    }

    /**
     * Get a JSONP promise
     * @param {string} url - Url target
     * @param {number} limit - Timeout limit in ms
     * @return {Promise<*|Error>} - JSONP response or timeout error
     */
    static promise( url, limit = 10000 ) {
        return new Promise( ( resolve, reject ) => {
            new JsonP( url, resolve, reject, limit );
        } );
    }

    /**
     * Constructor
     * @constructor
     * @param {string} url - Url target
     * @param {JsonPCallback|Function} success - Success callback
     * @param {null|JsonPTimeoutCallback|Function} timeout - Timeout callback
     * @param {null|number} limit - Timeout limit in ms
     */
    constructor( url, success, timeout = null, limit = 10000 ) {

        // Url check
        if ( typeof url !== 'string' || !url.length ) {
            throw new Error( 'JsonP::constructor() Argument url must be an url string' );
        }

        // Timeout limit
        if ( Number.isNaN( limit ) || typeof limit !== 'number' ) {
            throw new Error( 'JsonP::constructor() Argument limit must be an integer' );
        }
        this.#limit = limit;

        // Require success callback
        if ( typeof success !== 'function' ) {
            throw new Error( 'JsonP::constructor() Argument success must be a Function' );
        }
        this.#callback_success = success;

        // Set default empty timeout
        this.#callback_timeout = timeout;
        if ( !timeout || typeof timeout !== 'function' ) {
            this.#callback_timeout = ( src ) => {
                window.console.error( this.constructor.name + '::callback_timeout Timeout after ' + this.#limit + 'ms:', src );
            };
        }

        // Global callback name
        this.#callback = this.constructor.getCallbackName();

        // Create global callback
        this.#create_callback();

        // Create script
        this.#create_script( url );
    }

    /**
     * Create global callback
     * @private
     * @return {void}
     */
    #create_callback() {
        if ( !window[ this.#callback ] ) {
            window[ this.#callback ] = ( response ) => {
                this.#clearTimeout();
                this.#callback_success( response );
                this.#destroy();
            };
        }
    }

    /**
     * Create loading script
     * @private
     * @param {string} src - Source url
     * @return {void}
     */
    #create_script( src ) {
        const regex = new RegExp( '{callback}', 'g' );
        src = src.replace( regex, encodeURIComponent( this.#callback ) );

        // Create script
        this.#script = document.createElement( 'script' );
        this.#script.type = 'text/javascript';
        this.#script.async = true;
        this.#script.src = src;
        document.getElementsByTagName( 'head' )[ 0 ].appendChild( this.#script );

        // Clear and start loading timeout
        this.#clearTimeout();
        this.#timeout = window.setTimeout( () => {
            this.#destroy();
            this.#callback_timeout( new Error( 'JsonP::timeout() Timeout for: ' + src ) );
        }, this.#limit );
    }

    /**
     * Clear loading timeout
     * @private
     * @return {void}
     */
    #clearTimeout() {
        if ( this.#timeout ) {
            window.clearTimeout( this.#timeout );
            this.#timeout = null;
        }
    }

    /**
     * Destroy self after completion
     * @private
     * @return {void}
     */
    #destroy() {
        this.#script.remove();
        this.#script = null;
        delete window[ this.#callback ];
    }
}
