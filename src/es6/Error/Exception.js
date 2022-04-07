/**
 * Exception
 * @class
 */
export class Exception extends Error {

    /**
     * Previous error
     * @public
     * @property
     * @type {null|string|Error}
     */
    previous = null;

    /**
     * Add previous to stack
     * @public
     * @property
     * @type {boolean}
     */
    previousToStack = true;

    /**
     * Previous error prefix
     * @public
     * @property
     * @type {null|string}
     */
    previousPrefix = '> Caused by: ';

    /**
     * Constructor
     * @constructor
     * @param {string} message - Exception message
     * @param {null|Error|Exception} previous - Previous error
     */
    constructor( message, previous = null ) {
        super( message );

        // Ensure error name
        this.name = this.constructor.name;

        // Get stacktrace
        if ( typeof Error.captureStackTrace === 'function' ) {
            Error.captureStackTrace( this, this.constructor );
        } else {
            this.stack = new Error( message ).stack;
        }

        // Set previous
        this.previous = previous || null;

        // Update stack with previous
        this.addPreviousToStack();
    }

    /**
     * Add previous error to stack
     * @public
     * @return {void}
     */
    addPreviousToStack() {

        // Only if enabled and stack is a string
        if ( this.previousToStack && typeof this.stack === 'string' ) {

            // There is a previous error and it should be displayable
            if ( this.previous
                && ( this.previous instanceof Error || this.previous.toString || typeof this.previous === 'string' ) ) {

                // Add previous prefix
                this.stack = this.stack + '\n';
                if ( this.previousPrefix ) this.stack = this.stack + this.previousPrefix;

                // Add the previous stack or error to the current stack
                this.stack = this.stack + ( typeof this.previous.stack === 'string' ? this.previous.stack : this.previous );
            }
        }
    }
}
