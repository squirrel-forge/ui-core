# Changelog

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
