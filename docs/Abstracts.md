### @squirrel-forge/ui-core
> [Back to table of contents](../README.md#table-of-contents)

# Documentation
### Javascript / Abstracts
> [Table of contents](../README.md#table-of-contents) <[ Abstracts ]> [States](States.md)

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
  static configDotNameFromAttr( name ) {} // string
  static configCamelNameFromDot( name ) {} // string
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
For more details check the [UiComponent source file](../src/es6/Abstracts/UiComponent.js).

#### Settings mechanics
Settings may be passed via the constructor, but can also be set via a *data-config* attribute:
```html
<component data-config='{"name":"value"}'></component>
```
or via named attributes:
```html
<component data-name="value"></component>
```
The data- is removed and dashes replaced with dots when converting to a config option.

---

### UiPlugin
UiPlugin class - Plugin extension with some ui and dom based methods.

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
For more details check the [UiPlugin source file](../src/es6/Abstracts/UiPlugin.js).

---

> [Table of contents](../README.md#table-of-contents) <[ Abstracts ]> [States](States.md)