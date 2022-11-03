# Changelog

## 0.11.3
 - Added *extend* property to *UiTemplate* class for better data handling.
 - Added more code docs.
 - Fixed *__forceExtend* when no setting are provided.

## 0.11.2
 - On *UiComponent* construction allow ```settings.__forceExtend = true``` to extend the config and overwrite types.

## 0.11.1
 - Fixed *UiTemplate.render* missing return value.
 - Improved *UiTemplate* debug output.

## 0.11.0
 - Added *UiTemplate* class for rendering template data.
 - Minor debug improvement for the static *UiComponent.make()* and *UiComponent.makeAll()* methods.
 - Improved code docs and added inherited methods and properties.

## 0.10.4
 - Added *integer* and *float* parsing to *UiComponent.configValueFromAttr()* via basic regex.

## 0.10.3
 - Allow function call after *UiComponent* *initialized* event.
 - Added *requireDomRefs* method to *UiComponent* to ensure dom reference availability and throw errors.

## 0.10.2
 - Cleaned import statements.
 - Remove dev dependencies.

## 0.10.1
 - Improved documentation, code and readme.
 - Fixed *UiComponent.getDomRefs()* empty multiple return changed from null to array.

## 0.10.0
 - Updated dependencies.

## 0.9.0
 - Changed *UiComponent* constructor arguments.
 - Added *UiComponent.make()* and *UiComponent.makeAll()* abstract factories.
 - Added *UiComponent.children* property and *UiComponent.eachChild()* method.
 - Optionalized *UiComponent.plugins* construction and method calls.
 - Locked *UiComponent* init methods to private states.

## 0.8.9
 - Update documentation.
 - Update dependencies.

## 0.8.8
 - Fixed *UiComponent.constructor* *Plugins.applyConfig* call.

## 0.8.7
 - Update dependencies.

## 0.8.6
 - Improved *UiComponent* config loading order including plugin scoped configs.
 - Added *UiPlugin.applyConfig()* to apply local plugin *options* to plugin context config.

## 0.8.5
 - Added additional camel casing for attribute config names.

## 0.8.4
 - Fixed *ElementClassStates* timeout collision with multiple *autoUnset* states on the same element.

## 0.8.3
 - Improved *UiComponent* docs.
 - Fixed *UiComponent.getConfigFromAttributes()* to disregard unwanted attribute conversion.

## 0.8.2
 - Updated dependencies.

## 0.8.1
 - Added init complete check for *UiPlugin.initComponent()*, now throws exception if run a second time.

## 0.8.0
 - Restructured package separated to *@squirrel-forge/ui-util@0.8.2* module.

## 0.7.2
 - Improve logging for *Plugins* class and removed internal loaded log.

## 0.7.1
 - Fixed *Config.extendInheritance()* arguments order of merge use.

## 0.7.0
 - Added *escapeHTML* for string escaping.
 - Added *getScrollbarWidth* to calculate browser scrollbar width.
 - Added *getVisibility* to get element visibility details.
 - Added *EventDispatcher.isSimulated* and *EventDispatcher.hasSimulated()* for reflective purposes.
 - Renamed *EventDispatcher.dispatchEvent()* argument data to detail.
 - Added *EventDispatcher.isCompat()* static method.
 - Improved *EventDispatcher* argument validation.
 - Improved *Config*, fixed inheritance.
 - Improved *Scroller*, removed event context is always window and added initial ready event option.

## 0.6.0
 - Added *scrollComplete* callback handler.
 - Added *Scroller* class utility for initial and binding scrollTo links.
 - Added *scrollTo* function including an offset argument.
 - Added *slideToggle, slideHide, slideShow* vertical slide css animation functions.
 - Streamlined error messages of various functions.

## 0.5.0
 - Initial prototype.
