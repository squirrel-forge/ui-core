/**
 * Requires
 */
import { EventDispatcher } from '../Events/EventDispatcher.js';
import { docReady } from '../Events/docReady.js';
import { scrollComplete } from './scrollComplete.js';
import { scrollTo } from './scrollTo.js';
import { mergeObject } from '../Object/mergeObject.js';
import { isPojo } from '../Object/isPojo.js';

/**
 * @typedef {Object} ScrollerOptions
 * @property {null|number|HTMLElement} offset - Offset pixels or element, default: null
 * @property {boolean} bind - Bind scrollTo links, default: true
 * @property {document.body|HTMLElement} context - Context to select scrollTo links from, default: document.body
 * @property {string} selector - Scroll to link selector, default: [href^="#"]
 * @property {boolean} capture - Capture initial scroll, default: true
 * @property {number|'ready'} initial - Initial scroll delay after capture
 * @property {number} hashClean - scrollComplete delay, default: 300
 */

/**
 * Scroller
 * @class
 */
export class Scroller extends EventDispatcher {

    /**
     * Get url with new hash value
     * @public
     * @static
     * @param {string} hash - New hash string excluding #
     * @param {null|string} url - Custom url, default uses location.href
     * @return {string} - Updated href string
     */
    static getUrlWithHash( hash, url = null ) {
        return ( url || window.location.href ).split( '#' )[ 0 ] + '#' + hash;
    }

    /**
     * Config
     * @public
     * @property
     * @type {null|Object|ScrollerOptions}
     */
    config = null;

    /**
     * Initial scroll target
     * @public
     * @property
     * @type {null|HTMLElement}
     */
    initial = null;

    /**
     * Constructor
     * @constructor
     * @param {Object|ScrollerOptions} options - Scroller options
     * @param {null|console|Object} debug - Debug object
     */
    constructor( options = {}, debug = null ) {
        super( window, null, debug );

        // Set default config
        this.config = {
            offset : null,
            bind : true,
            context : document.body,
            selector : '[href^="#"]',
            capture : true,
            initial : 1000,
            hashClean : 300,
        };

        // Update config
        if ( isPojo( options ) ) {
            mergeObject( this.config, options );
        }

        // Capture and bind
        if ( this.config.capture ) this.#capture();
        if ( this.config.bind ) this.#bind();
    }

    /**
     * Event scroll to click
     * @private
     * @param {Event} event - Click event
     * @return {void}
     */
    #event_scrollToClick( event ) {
        const id = event.target.getAttribute( 'href' ).substr( 1 );
        const target = document.getElementById( id );
        if ( target ) {
            scrollTo( target, this.config.offset );
            event.preventDefault();
        } else if ( this.debug ) {
            this.debug.warn( this.constructor.name + '::event_scrollToClick No valid target for: ', id );
        }
    }

    /**
     * Bind scroll to events
     * @private
     * @return {void}
     */
    #bind() {
        const links = this.config.context.querySelectorAll( this.config.selector );
        if ( !links.length && this.debug ) {
            this.debug.warn( this.constructor.name + '::bind No scrollTo links found in context:', this.config.context );
        }
        for ( let i = 0; i < links.length; i++ ) {
            links[ i ].addEventListener( 'click', ( event ) => { this.#event_scrollToClick( event ); } );
        }
    }

    /**
     * Capture hash scroll
     * @private
     * @return {void}
     */
    #capture() {
        const hash = window.location.hash;

        // Catch hash and prevent native scroll, to allow initial smooth scroll
        if ( hash && hash.length > 1 ) {

            // Only update if an actual target is found
            this.initial = document.getElementById( hash.substr( 1 ) );
            if ( this.initial ) {
                history.replaceState( null, document.title, this.constructor.getUrlWithHash( 's2:' + hash.substr( 1 ) ) );
            }
        }

        // Scroll when ready
        if ( this.config.initial === 'ready' ) {
            docReady( () => { this.#initial_scroll( hash ); } );
        } else {

            // Delayed initial scroll
            window.setTimeout( () => { this.#initial_scroll( hash ); }, this.config.initial );
        }
    }

    /**
     * Scroll to initial element and reset hash
     * @private
     * @param {string} hash - Hash to reset to
     * @return {void}
     */
    #initial_scroll( hash ) {
        if ( this.initial ) {

            // Restore hash after scroll/delay
            scrollComplete( () => {
                history.replaceState( null, document.title, this.constructor.getUrlWithHash( hash.substr( 1 ) ) );
                this.dispatchEvent( 'scroll.initial.complete', { initial : this.initial } );
            }, this.config.hashClean );

            // Scroll to initial target
            scrollTo( this.initial, this.config.offset );
        }
    }
}
