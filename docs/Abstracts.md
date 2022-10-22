### @squirrel-forge/ui-core
> [Back to table of contents](../README.md#table-of-contents)

# Documentation
### Javascript / Abstracts
> [Table of contents](../README.md#table-of-contents) <[ Abstracts ]> [States](States.md)

## Table of contents
 - [UiComponent](#uicomponent)
 - [UiPlugin](#uiplugin)

---

### UiComponent
UiComponent class - Base abstract for ui components with some useful methods.
The component extends [EventDispatcher](https://github.com/squirrel-forge/ui-util/blob/main/docs/Events.md#eventdispatcher) from [@squirrel-forge/ui-util](https://github.com/squirrel-forge/ui-util) module.

#### Class overview
```javascript
class UiComponent extends EventDispatcher {
  static make( element, settings = null, plugins = null, parent = null, debug = null, Construct = null ) {} // UiComponent
  static makeAll( settings = null, plugins = null, parent = null, context = document, debug = null, Construct = null ) {} // UiComponent[]
  static configDotNameFromAttr( name ) {} // string
  static configCamelNameFromDot( name ) {} // string
  static configValueFromAttr( value ) {} // *
  constructor( element, settings = null, defaults = {}, extend = [], states = {}, plugins = [], init = true, debug = null ) {}
  selector : String
  type : String
  dom : HTMLElement
  config : Config
  states : ComponentStates
  plugins : Plugins
  children : Array
  init( afterInitialized = null ) {} // void
  _initChildren() {} // void
  eachChild( filter, callback = null ) {} // void
  getConfigFromAttributes() {} // null|Object
  getDomRefs( name, multiple = true ) {} // null|HTMLElement|NodeList
  requireDomRefs( refs ) {} // void
  event_state( event ) {} // void
}
```
For more details check the [UiComponent source file](../src/js/Abstracts/UiComponent.js).

#### Events
 - **initialized** - Fired after the component has initialized, note: *currently child components might not be fully initialized at this time*.

#### Settings mechanics
Settings may be passed via the constructor, but can also be set via a *data-config* attribute:
```html
<component data-config='{"name":"value"}'></component>
```
or via named attributes:
```html
<component data-name="value"></component>
```
The data- is removed when converting to a config option, two names are generated, dashes replaced with dots and a lowerCamelCase version, see following examples.
```
data-name > "name"
data-some-name > "some.name" and "someName"
```
In most cases options are only set if they exist, preventing collisions when extending the *UiComponent* class is required when defining option names, but the convention does not cause any further issues.

---

### UiPlugin
UiPlugin class - Plugin extension with some ui and dom based methods.
The component extends [Plugin](https://github.com/squirrel-forge/ui-util/blob/main/docs/Logic.md#Plugin) from [@squirrel-forge/ui-util](https://github.com/squirrel-forge/ui-util) module.

#### Class overview
```javascript
class UiPlugin extends Plugin {
  constructor( options = {}, context = null, debug = null ) {}
  extendConfig : null|Object
  extendStates : null|Object
  configOptions : Boolean
  registerEvents : null|Array
  extendDefaultConfig( extend, context ) {} // void
  extendAvailableStates( states, context ) {} // void
  applyConfig( config, context ) {} // void
  initComponent( context ) {} // void
}
```
For more details check the [UiPlugin source file](../src/js/Abstracts/UiPlugin.js).

---

> [Table of contents](../README.md#table-of-contents) <[ Abstracts ]> [States](States.md)
