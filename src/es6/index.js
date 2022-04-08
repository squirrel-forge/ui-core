/**
 * @module @squirrel-forge/ui-core
 * @description A collection of ui core modules, functions and abstracts.
 * @file index.js
 * @copyright 2022
 * @author Daniel Hartwell aka. siux <me@siux.info>
 */

/**
 * Animation
 */

/**
 * Array
 */
export { mergeArray } from './Array/mergeArray.js';

/**
 * Dev
 */
export { ConsoleInterceptor } from './Dev/ConsoleInterceptor.js';
export { tabFocus } from './Dev/tabFocus.js';

/**
 * Error
 */
export { Exception } from './Error/Exception.js';

/**
 * Events
 */
export { bindNodeList } from './Events/bindNodeList.js';
export { debounce } from './Events/debounce.js';
export { docReady } from './Events/docReady.js';
export { EventDispatcher } from './Events/EventDispatcher.js';

/**
 * HTML
 */
export { appendAfter } from './HTML/appendAfter.js';
export { appendHTML } from './HTML/appendHTML.js';
export { attributeJSON } from './HTML/attributeJSON.js';
export { getElementTagType } from './HTML/getElementTagType.js';
export { prependChild } from './HTML/prependChild.js';
export { uniqid, requireUniqid } from './HTML/uniqid.js';
export { unwrap } from './HTML/unwrap.js';
export { wrap } from './HTML/wrap.js';

/**
 * HTTP
 */
export { AsyncRequest } from './HTTP/AsyncRequest.js';
export { JsonP } from './HTTP/JsonP.js';

/**
 * Number
 */
export { convertBytes } from './Number/convertBytes.js';
export { gcd } from './Number/gcd.js';
export { isEven } from './Number/isEven.js';
export { isFloat } from './Number/isFloat.js';
export { leadingZeros } from './Number/leadingZeros.js';
export { rand } from './Number/rand.js';
export { round } from './Number/round.js';

/**
 * Object
 */
export { cloneObject } from './Object/cloneObject.js';
export { isPojo } from './Object/isPojo.js';
export { mergeObject } from './Object/mergeObject.js';
export { strAccess } from './Object/strAccess.js';
export { strCreate } from './Object/strCreate.js';

/**
 * String
 */
export { simpleReplace } from './String/simpleReplace.js';
export { str2node } from './String/str2node.js';
export { str2time } from './String/str2time.js';
export { strand } from './String/strand.js';
export { strSlug } from './String/strSlug.js';
export { trimChar } from './String/trimChar.js';
export { ucfirst } from './String/ucfirst.js';

/**
 * Ui core
 */
export { ComponentStates } from './UiCore/ComponentStates.js';
export { Config } from './UiCore/Config';
export { ElementClassStates } from './UiCore/ElementClassStates.js';
export { Plugin } from './UiCore/Plugin.js';
export { Plugins } from './UiCore/Plugins.js';
export { UiComponent } from './UiCore/UiComponent.js';
export { UiPlugin } from './UiCore/UiPlugin.js';

/**
 * Var
 */
export { cast2type } from './Var/cast2type.js';
export { isEmpty } from './Var/isEmpty.js';
