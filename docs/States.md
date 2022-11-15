### @squirrel-forge/ui-core
> [Back to table of contents](../README.md#table-of-contents)

# Documentation
### Javascript / States
> [Renderers](Renderers.md) <[ States ]> [Table of contents](../README.md#table-of-contents)

## Table of contents
 - [ComponentStates](#componentstates)
 - [ElementClassStates](#elementclassstates)

---

### ComponentStates
ComponentStates class - Ui component global and additional states handler.

#### Class overview
```javascript
class ComponentStates {
  constructor( component, states = null ) {}
  global : null|String
  exposed : Object
  extend( states ) {} // void
  is( name ) {} // boolean
  has( name ) {} // boolean
  get( name ) {} // Object
  set( name ) {} // void
  unset( name ) {} // void
}
```
For more details check the [ComponentStates source file](../src/js/States/ComponentStates.js).

#### Events
Note: *All events are dispatched on the component reference*.
 - **state.set** - Fired when a non global state is set.
 - **state.changed** - Fired when the global state changed.
 - **state.unset** - Fired when a global or non global state is unset.

---

### ElementClassStates
ElementClassStates class - Loose element class states with callbacks and relations.

#### Class overview
```javascript
class ElementClassStates {
  constructor( states = null ) {}
  exposed : Object
  extend( states ) {} // void
  is( name, element ) {} // boolean
  has( name ) {} // boolean
  get( name ) {} // Object
  set( name, element ) {} // void
  unset( name, element ) {} // void
}
```
For more details check the [ElementClassStates source file](../src/js/States/ElementClassStates.js).

---

> [Renderers](Renderers.md) <[ States ]> [Table of contents](../README.md#table-of-contents)
