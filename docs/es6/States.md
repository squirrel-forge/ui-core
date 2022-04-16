### @squirrel-forge/ui-util
> [Back to table of contents](../README.md)

# Documentation
### Javascript / States
> [Abstracts](Abstracts.md) <[ States ]> [Table of contents](../README.md)

## Table of contents
 - [ComponentStates](#ComponentStates)
 - [ElementClassStates](#ElementClassStates)

---

### ComponentStates
ComponentStates class - Ui component global and additional states handler.

#### Class overview
```javascript
// Component event names: state.set, state.changed, state.unset
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
For more details check the [ComponentStates source file](../../src/es6/States/ComponentStates.js).

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
For more details check the [ElementClassStates source file](../../src/es6/States/ElementClassStates.js).

---

> [Abstracts](Abstracts.md) <[ States ]> [Table of contents](../README.md)
