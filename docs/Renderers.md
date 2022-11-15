### @squirrel-forge/ui-core
> [Back to table of contents](../README.md#table-of-contents)

# Documentation
### Javascript / Renderers
> [Abstracts](Abstracts.md) <[ Renderers ]> [States](States.md)

## Table of contents
 - [UiTemplateRenderer](#uitemplaterenderer)

---

### UiTemplateRenderer
UiTemplateRenderer class - Template render class for handling dynamic render data.

#### Class overview
```javascript
class UiTemplateRenderer {
    static isRenderData( data ) {} // Boolean
    static debug : null|Object
    static tmpl : Object
    static add( name, tmpl ) {} // void
    static require( name, tmpl ) {} // void
    static get( name ) {} // UiTemplate
    static as( data, trace ) {} // Object
    static data( data, trace ) {} // string
    static recursive( data, trace ) {} // string
    static render( data ) {} // string
    static node( data = null ) {} // NodeList|Array
    static append( to, data = null ) {} // NodeList|Array
}
```
For more details check the [UiTemplateRenderer source file](../src/js/Renderers/UiTemplateRenderer.js).

---

> [Abstracts](Abstracts.md) <[ Renderers ]> [States](States.md)
