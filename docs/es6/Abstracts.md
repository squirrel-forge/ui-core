### @squirrel-forge/ui-core
> [Back to table of contents](../README.md)

# Documentation
### Javascript / Abstracts
> [Table of contents](../README.md) <[ Abstracts ]> [States](States.md)

## Table of contents
 - [UiComponent](#UiComponent)
 - [UiPlugin](#UiPlugin)

---

### UiComponent
UiComponent class - Base abstract for ui components with some useful methods.

#### Class overview
```javascript
// Event names: initialized
class UiComponent extends EventDispatcher {
  static configNameFromAttr( name ) {} // string
  static configValueFromAttr( value ) {} // *
  constructor( element, settings = null, defaults = {}, extend = [], states = {}, plugins = [], init = true, debug = null ) {}
  dom : HTMLElement
  config : Config
  states : ComponentStates
  plugins : Plugins
  init() {} // void
  getConfigFromAttributes() {} // null|Object
  getDomRefs( name, multiple = true ) {} // null|HTMLElement|NodeList
  event_state( event ) {} // void
}
```
For more details check the [UiComponent source file](../../src/es6/Abstracts/UiComponent.js).

---

### UiPlugin
UiPlugin class - Plugin extension with some ui and dom based methods.

#### Class overview
```javascript
class UiPlugin extends Plugin {
  constructor( options = {}, context = null, debug = null ) {}
  extendConfig : null|Object
  extendStates : null|Object
  registerEvents : null|Array
  extendDefaultConfig( extend, context ) {} // void
  extendAvailableStates( states, context ) {} // void
  initComponent( context ) {} // void
}
```
For more details check the [UiPlugin source file](../../src/es6/Abstracts/UiPlugin.js).

---

> [Table of contents](../README.md) <[ Abstracts ]> [States](States.md)
