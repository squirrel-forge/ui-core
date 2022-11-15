/**
 * Requires
 */
import { Exception, isPojo, mergeObject, str2node, strCreate } from '@squirrel-forge/ui-util';

/**
 * Ui template renderer exception
 * @class
 * @extends Exception
 */
class UiTemplateRendererException extends Exception {}

/**
 * @typedef {string|UiTemplateRendererTemplateData|Array<UiTemplateRendererTemplateData>|Function} UiTemplateRendererData
 */

/**
 * @typedef {Object} UiTemplateRendererTemplateData
 * @property {string} template - Template reference name
 * @property {UiTemplateData} data - Template data
 * @property {UiTemplateRendererCompileData} as - Precompile template data
 */

/**
 * @typedef {Object} UiTemplateRendererCompileData
 * @property {UiTemplateRendererData} * - Any template data property that needs to be compiled
 */

/**
 * Example nested data
 * {
 *   template : 'name',
 *   data : {},
 *   as : {
 *     id : () => { return 'foo'; },
 *     content : [
 *       {
 *         template : 'name',
 *         data : {...},
 *         as : {...},
 *       },
 *       'foo',
 *     ],
 *     'header.controls.custom' => 'foo',
 * };
 */

/**
 * Ui template renderer
 * @class
 */
export class UiTemplateRenderer {

    /**
     * Check for render data structure
     * @public
     * @static
     * @param data
     * @return {boolean} - True if render data
     */
    static isRenderData( data ) {
        return isPojo( data ) && typeof data.template === 'string' && isPojo( data.data );
    }

    /**
     * Debug object
     * @public
     * @static
     * @property
     * @type {null|console|Object}
     */
    static debug = null;

    /**
     * Templates reference
     * @public
     * @static
     * @type {Object}
     */
    static tmpl = {};

    /**
     * Set template
     * @public
     * @static
     * @param {string} name - Template reference
     * @param {UiTemplate} tmpl - Template instance
     * @return {void}
     */
    static add( name, tmpl ) {
        if ( typeof tmpl !== 'object' ) throw new UiTemplateRendererException( 'Must be a template object: ' + name );
        if ( this.tmpl[ name ] ) throw new UiTemplateRendererException( 'Template already defined: ' + name );
        this.tmpl[ name ] = tmpl;
    }

    /**
     * Require template
     * @public
     * @static
     * @param {string} name - Template reference
     * @param {UiTemplate} tmpl - Template instance
     * @return {void}
     */
    static require( name, tmpl ) {
        try {
            this.add( name, tmpl )
        } catch ( e ) {
            if ( typeof tmpl !== 'object' ) throw e;
        }
    }

    /**
     * Get template class
     * @public
     * @static
     * @param {string} name - Template reference
     * @return {UiTemplate} - Template instance
     */
    static get( name ) {
        if ( this.tmpl && this.tmpl[ name ] ) return this.tmpl[ name ];
        throw new UiTemplateRendererException( 'Unknown template: ' + name );
    }

    /**
     * Render data.as block
     * @public
     * @static
     * @param {Object} data - As data block
     * @param {string} trace - Trace string
     * @return {Object} - Rendered object data
     */
    static as( data, trace ) {
        const result = {};
        const entries = Object.entries( data );
        for ( let i = 0; i < entries.length; i++ ) {
            const [ item_path, item_data ] = entries[ i ];
            const rendered = this.recursive( item_data, trace + '.' + item_path );
            strCreate( item_path, rendered, result, false, false, this.debug );
        }
        return result;
    }

    /**
     * Render data
     * @public
     * @static
     * @param {UiTemplateRendererTemplateData} data - Render object
     * @param {string} trace - Trace string
     * @return {string} - Rendered template
     */
    static data( data, trace ) {
        const tmpl = this.get( data.template );
        if ( this.debug ) this.debug.log( this.name + '::data template:', data.template, '[' + trace + ']' );
        if ( isPojo( data.as ) ) {
            const as = this.as( data.as, trace + '.as' );
            if ( this.debug ) this.debug.log( this.name + '::data as:', as, '[' + trace + ']' );
            mergeObject( data.data, as, true, true );
        }
        return tmpl.render( data.data );
    }

    /**
     * Render recursive
     * @public
     * @static
     * @param {UiTemplateRendererData} data - Render object or array
     * @param {string} trace - Trace string
     * @return {string} - Rendered data
     */
    static recursive( data, trace ) {
        const to = typeof data;
        if ( to === 'string' ) {
            return data;
        } else if ( to === 'function' ) {

            // Render custom function
            let result;
            try {
                result = data( trace );
            } catch ( e ) {
                throw new UiTemplateRendererException( 'Failed to render custom callback [' + trace + ']', e );
            }
            if ( typeof result !== 'string' ) throw new UiTemplateRendererException( 'A custom callback must always return a string [' + trace + ']' );
            return result;

        } else if ( data instanceof Array ) {

            // Render array of unknowns
            const result = [];
            for ( let i = 0; i < data.length; i++ ) {
                result.push( this.recursive( data[ i ], trace + `[${i}]` ) );
            }
            return result.join( '' );

        } else if ( this.isRenderData( data ) ) {
            return this.data( data, trace );
        } else {
            if ( this.debug ) this.debug.error( this.name + '::render', data );
            throw new UiTemplateRendererException( 'Unknown data type: ' + typeof data + ' [' + trace + ']' );
        }
    }

    /**
     * Render
     * @public
     * @static
     * @param {UiTemplateRendererData} data - Render object or array
     * @return {string} - Rendered data
     */
    static render( data ) {
        return this.recursive( data, 'data' );
    }

    /**
     * Render as node
     * @public
     * @static
     * @param {null|UiTemplateData|Object|Array<UiTemplateData|Object>} data - Template data /list
     * @return {NodeList|Array} - Rendered nodes or empty array
     */
    static node( data = null ) {
        const rendered = this.render( data );
        if ( rendered ) return str2node( rendered );
        return [];
    }

    /**
     * Append rendered data
     * @public
     * @static
     * @param {HTMLElement} to - Element to append to
     * @param {null|Object|Array} data - Template data /list
     * @return {NodeList|Array} - Rendered nodes or empty array
     */
    static append( to, data = null ) {
        if ( !( to instanceof HTMLElement ) ) throw new UiTemplateException( 'Requires a HTMLElement to append to' );
        const nodes = this.node( data );
        for ( let i = 0; i < nodes.length; i++ ) {
            to.appendChild( nodes[ i ] );
        }
        return nodes;
    }
}
