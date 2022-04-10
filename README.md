# @squirrel-forge/ui-core
A collection of ui classes, functions and abstracts made for the browser and babel compatible.

## Installation

```
npm i @squirrel-forge/ui-core
```

## Usage

```
import { Class, function } from '@squirrel-forge/ui-core';
```

### Namespaces
Package contents listing by namespace, if you are looking for examples check the code docs and any of the dependent packages.

#### Animation
 - scrollComplete( callback, delay, context ) : void
 - Scroller( options, context, debug )
   - static getUrlWithHash( hash, url ) : string
   - config : Object
 - scrollTo( element, offset, behaviour, minDiff ) : void
 - slideToggle( element, speed, easing, callback ) : void
 - slideHide( element, speed, easing, callback ) : void
 - slideShow( element, speed, easing, callback ) : void

#### Array
 - mergeArray( unique, clone, arr, arr, .. ) : Array

#### Dev
 - ConsoleInterceptor( host, global )
   - console : console
   - native : boolean|Array
   - events : boolean|Array
 - tabFocus( style, offset, log ) : Function

#### Error
 - Exception( message, previous ) extends Error
   - previous : *
   - previousPrefix : string
   - previousToStack : boolean
   - addPreviousToStack() : void

#### Events
 - bindNodeList( nodelist, eventparams ) : void
 - debounce( callback, delay ) : Function
 - docReady( callback ) : void
 - EventDispatcher( element, parent, debug )
   - debug : null|console
   - target : null|HTMLElement
   - parent : null|EventDispatcher|HTMLElement
   - isSimulated : boolean
   - hasSimulated( name ) : boolean
   - dispatchEvent( name, data, bubbles, cancelable ) : void
   - addEventListener( name, callback, options ) : void
   - removeEventListener( name, callback, options ) : void
   - addEventList( events ) : void

#### HTML
 - appendAfter( insert, after ) : void
 - appendHTML( element, str ) : void
 - attributeJSON( name, element, silent ) : null|Object
 - getElementTagType( element ) : string
 - prependChild( insert, before ) : void
 - uniqid( prefix, entropy ) : string
 - requireUniqid( element, prefix, entropy ) : string
 - unwrap( element ) : void
 - wrap( elements, wrapper, strict ) : HTMLElement

#### HTTP
 - AsyncRequest( options, parent, debug ) extends EventDispatcher
   - static unique_url( url, cache ) : string
   - send( data, modifyProcessed ) : void
   - abort() : void
 - JsonP( url, success, timeout, limit )
   - static getCallbackName( prefix ) : string
   - static promise( url, limit ) : Promise

#### Number
 - convertBytes( bytes, decimals, style, return, unit ) : string|Object
 - gcd( a, b ) : number
 - isEven( num ) : boolean
 - isFloat( num ) : boolean
 - leadingZeros( num, length ) : string
 - rand( min, max ) : number
 - round( num, decimals ) : number

#### Object
 - cloneObject( obj, recursive ) : Object
 - isPojo( obj ) : boolean
 - mergeObject( target, changes, extend, recursive, clone_array, no_array_merge ) : target
 - strAccess( strpath, subject, exact, debug ) : null|*
 - strCreate( strpath, value, target, replace, any, debug ) : target

#### String
 - simpleReplace( tmpl, data, prefix, suffix ) : string
 - str2node( str, multiple ) : null|HTMLElement|NodeList
 - str2time( str ) : null|Date
 - strand( entropy ) : string
 - strSlug( str ) : string
 - trimChar( str, remove ) : string
 - ucfirst( str ) : string

#### UiCore
 - ComponentStates( component, states )
   - global : string
   - exposed : Object
   - extend( states ) : void
   - is( name ) : boolean
   - has( name ) : boolean
   - get( name ) : Object
   - set( name ) : void
   - unset( name ) : void
 - Config( defaults, extended )
   - static clone( data ) : Object
   - static merge( data ) : void
   - defaults : Object
   - data : Object
   - exposed : Object
   - get( name ) : null|*
   - set( name, value ) : void
   - merge( data, extend ) : void
 - ElementClassStates( states )
   - exposed : Object
   - extend( states ) : void
   - is( name, element ) : boolean
   - has( name ) : boolean
   - get( name, element ) : Object
   - set( name, element ) : void
   - unset( name, element ) : void
 - Plugin( options, context, debug ) : abstract
   - options : *
   - debug : null|console
   - context : null|Object
   - _context_check( context ) : void
 - Plugins( plugins, context, append, debug )
   - debug : null|console
   - context : null|Object
   - load( plugins ) : void
   - init( constructor, options, replace ) : Object
   - runAsync( method, params, restrict ) : Array
   - run( method, params, restrict ) : Object
   - exec( name, method, params, silent ) : *
   - get( name ) : null|Object
   - has( name ) : boolean
 - UiComponent( element, settings, defaults, extend, states, plugins, init, debug ) extends EventDispatcher
   - static configNameFromAttr( name ) : string
   - static configValueFromAttr( value ) : *
   - dom : HTMLElement
   - config : Config
   - states : ComponentStates
   - plugins : Plugins
   - init() : void
   - getConfigFromAttributes() : null|Object
   - getDomRefs( name, multiple ) : HTMLElement|NodeList
   - event_state( event ) : void
 - UiPlugin( options, context, debug ) : abstract
   - extendConfig : null|Object
   - extendStates : null|Object
   - registerEvents : null|Array
   - extendDefaultConfig( extend, context ) : void
   - extendAvailableStates( states, context ) : void
   - initComponent( context ) : void

#### Var
 - cast2type( value, type, no_cenvert, splitter, false ) : null|*
 - isEmpty( value ) : boolean


## Issues and docs

If you encounter any issues, please report [here](https://github.com/squirrel-forge/ui-core/issues).

---
Check the sourcecode on [github](https://github.com/squirrel-forge/ui-core) for detailed comments.
