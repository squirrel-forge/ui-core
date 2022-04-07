/**
 * Requires
 */
import { EventDispatcher } from '../Events/EventDispatcher.js';
import { Exception } from '../Error/Exception.js';
import { isPojo } from '../Object/isPojo.js';
import { str2node } from '../String/str2node.js';
import { mergeObject } from '../Object/mergeObject.js';

/**
 * Async request exception
 * @class
 */
class AsyncRequestException extends Exception {}

/**
 * @typedef {Object} AsyncRequestConfig - Async Request Config
 * @property {string} url
 * @property {string} user
 * @property {string} pwd
 * @property {('head'|'get'|'post'|'put'|'delete'|'patch'|'options')} method
 * @property {boolean} cache
 * @property {('auto'|'html','string','json')} type
 * @property {Array.<number>} successStatus
 */

/**
 * Async request
 * @class
 */
export class AsyncRequest extends EventDispatcher {

    /**
     * Request object
     * @private
     * @property
     * @type {null|XMLHttpRequest}
     */
    #request = null;

    /**
     * Constructor
     * @constructor
     * @param {null|string|AsyncRequestConfig} options - Url or options object
     * @param {null|EventDispatcher} parent - Parent component
     * @param {null|console|Object} debug - Debug object
     */
    constructor( options = null, parent = null, debug = null ) {
        super( null, parent, debug );

        // Default properties/options
        Object.assign( this, {
            url : '',
            user : null,
            pwd : null,

            // Allowed methods: head, get, post, put, delete, patch, options
            method : 'get',
            cache : false,

            type : 'auto',
            successStatus : [ 200, 201, 202, 203 ],

            error : null,
            status : null,
            statusText : null,
            readyState : null,
            responseText : null,
            responseType : null,
            responseParsed : null,
            responseParsingError : null,
        } );

        // Shorthand only url
        if ( typeof options === 'string' ) {
            options = { url : options };
        }

        // Valid url or options
        if ( isPojo( options ) ) {
            mergeObject( this, options );
        } else {
            throw new AsyncRequestException( 'Url or options object required' );
        }

        // Create request
        this.#request = new XMLHttpRequest();

        // Request state change
        this.#request.addEventListener( 'readystatechange', ( event ) => { return this.#event_readystatechange( event ); } );

        // On progress handler
        this.#request.upload.addEventListener( 'progress', ( event ) => { return this.#event_progress( event ); } );
    }

    /**
     * Get unique request url with time param if cache is disabled
     * @public
     * @param {string} url - Url to add cache breaker
     * @param {boolean} cache - Set to not modify url
     * @return {string} - Url with optional cache breaker
     */
    static unique_url( url, cache = false ) {
        if ( !cache ) {
            const now = new Date().getTime() + '' + performance.now();
            url += ( url.indexOf( '?' ) >= 0 ? '&' : '?' ) + now;
        }
        return url;
    }

    /**
     * Send request
     * @public
     * @param {null|*} data - Data to send
     * @param {null|Function} modifyProcessed - Callback to modify processed request data
     * @return {void}
     */
    send( data = null, modifyProcessed = null ) {
        if ( typeof data === 'function' ) {
            modifyProcessed = data;
            data = null;
        }

        // Open request
        this.#request.open( this.method, this.constructor.unique_url( this.url, this.cache ), true, this.user, this.pwd );

        const processed = this.#process( data );

        // Modify request before actual sending
        if ( typeof modifyProcessed === 'function' ) {
            modifyProcessed( processed, this );
        }

        // Set headers
        this.#set_headers( processed );

        // Send request
        const data_methods = [ 'post', 'put', 'patch' ];
        if ( data_methods.includes( this.method ) ) {
            this.#request.send( processed.body );
        } else {
            this.#request.send();
        }
    }

    /**
     * Abort request
     * @public
     * @return {void}
     */
    abort() {
        if ( this.#request ) {
            this.#request.abort();
        }
    }

    /**
     * Ready state change event handler
     * @private
     * @param {Event} event - Event readystatechange
     * @return {void}
     */
    #event_readystatechange( event ) {

        // Propagate infos
        Object.assign( this, {
            status : this.#request.status,
            statusText : this.#request.statusText,
            readyState : this.#request.readyState,
            responseText : this.#request.responseText,
        } );

        // Parse response when completed
        if ( this.readyState === 4 ) {
            this.error = !this.successStatus.includes( this.status );
            if ( this.responseText ) {
                const method = '_parse_' + this.type;
                if ( typeof this[ method ] !== 'function' ) {
                    throw new AsyncRequestException( 'Response type method not defined: ' + method );
                }
                this[ method ]( event );
            }
        }

        // State change
        this.dispatchEvent( 'readystatechange', { event } );

        // Finished handlers
        if ( this.readyState === 4 ) {
            this.dispatchEvent( this.error ? 'error' : 'success', { event } );
            this.dispatchEvent( 'complete', { event } );
        }
    }

    /**
     * Progress event handler
     * @private
     * @param {Event} event - Event progress
     * @return {void}
     */
    #event_progress( event ) {
        let percent = Number.NaN;
        if ( event && event.lengthComputable ) {
            percent = event.loaded / event.total * 100;
        }
        this.dispatchEvent( 'progress', { percent, event } );
    }

    /**
     * Set headers
     * @private
     * @param {Object} processed - Processed data object
     * @return {void}
     */
    #set_headers( processed ) {
        let has_contentType = false;
        if ( processed.headers && processed.headers.length ) {
            for ( let i = 0; i < processed.headers.length; i++ ) {
                const header = processed.headers[ i ];
                this.#request.setRequestHeader( ...header );
                if ( header[ 0 ] === 'Content-Type' ) {
                    has_contentType = true;
                }
            }
        }
        if ( !has_contentType && typeof processed.body === 'string' ) {
            this.#request.setRequestHeader( 'Content-Type', 'text/plain' );
        }
    }

    /**
     * Process data
     * @private
     * @param {*} data - Data to send
     * @return {{headers: [], body: null}} - Processed data object
     */
    #process( data ) {
        const processed = { body : null, headers : [] };
        if ( data !== null ) {
            const to = typeof data;
            if ( to === 'object' ) {
                this.#process_object( data, processed );
            } else if ( to === 'string' || to === 'number' ) {
                processed.body = '' + data;
                processed.headers.push( [ 'Content-Length', processed.body.length ] );
            }
        }
        return processed;
    }

    /**
     * Process object data
     * @private
     * @param {Object} data - Data object
     * @param {Object} processed - Processed data object
     * @return {void}
     */
    #process_object( data, processed ) {

        // Plain json like structures
        if ( data instanceof Array || isPojo( data ) ) {
            processed.headers.push( [ 'Content-Type', 'application/json' ] );
            try {
                processed.body = JSON.stringify( data );
            } catch ( e ) {
                throw new AsyncRequestException( 'Failed to convert to json', e );
            }
            processed.headers.push( [ 'Content-Length', processed.body.length ] );

            // Form data
        } else if ( data instanceof FormData ) {
            processed.body = data;

            // Object to string conversion
        } else if ( typeof data.toString === 'function' ) {
            let converted = null;
            try {
                converted = data.toString();
            } catch ( e ) {
                throw new AsyncRequestException( 'Failed to convert to string', 4, e );
            }
            if ( typeof converted !== 'string' ) {
                throw new AsyncRequestException( 'The toString method did not return a string', 5 );
            }
            processed.body = converted;
            processed.headers.push( [ 'Content-Length', processed.body.length ] );

            // Failed to process
        } else {
            throw new AsyncRequestException( 'Unprocessable object', 6 );
        }
    }

    /**
     * Detect content type before parsing
     * @protected
     * @return {void}
     */
    _parse_auto() {
        const type = this.#request.getResponseHeader( 'Content-Type' );
        this.responseType = type;

        // application/json > plain text json
        const to = typeof this.responseText;
        if ( to === 'string' && this.responseText.trim().length ) {
            const src = this.responseText.trim();
            if ( type === 'application/json'
                || src[ 0 ] === '[' && src[ src.length - 1 ] === ']'
                || src[ 0 ] === '{' && src[ src.length - 1 ] === '}' ) {
                this._parse_json();
            } else if ( type === 'image/svg+xml' ) {
                this._parse_svg();
            } else if ( src.substr( 0, 5 ) !== '<?xml' && src.substr( 0, 9 ) !== '<!DOCTYPE'
                && ( type === 'text/html' || type === 'application/xhtml+xml' || type === 'application/x-httpd-php'
                || src[ 0 ] === '<' && src[ src.length - 1 ] === '>' ) ) {
                this._parse_html();
            } else {
                this._parse_string();
            }
        }
    }

    /**
     * Parse response as html element
     * @protected
     * @return {void}
     */
    _parse_html() {
        this.responseType = 'text/html';
        try {
            this.responseParsed = str2node( this.responseText, false );
        } catch ( e ) {
            this.responseType = null;
            this.responseParsed = null;
            this.responseParsingError = e;
        }
    }

    /**
     * Parse response as svg image
     * @protected
     * @return {void}
     */
    _parse_svg() {
        this.responseType = 'image/svg+xml';
        try {
            const result = new DOMParser().parseFromString( this.responseText, 'text/xml' );
            this.responseParsed = result.getElementsByTagName( 'svg' )[ 0 ];
            if ( !( this.responseParsed instanceof SVGElement ) ) {
                throw new AsyncRequestException( 'Failed to extract svg image' );
            }
        } catch ( e ) {
            this.responseType = null;
            this.responseParsed = null;
            this.responseParsingError = e;
        }
    }

    /**
     * Parse response as string
     * @protected
     * @return {void}
     */
    _parse_string() {
        if ( !this.responseType || !this.responseType.length ) {
            this.responseType = 'text/plain';
        }
        this.responseParsed = this.responseText || '';
    }

    /**
     * Parse response as json
     * @protected
     * @return {void}
     */
    _parse_json() {
        this.responseType = 'application/json';
        try {
            this.responseParsed = JSON.parse( this.responseText );
        } catch ( e ) {
            this.responseType = null;
            this.responseParsed = null;
            this.responseParsingError = e;
        }
    }
}
