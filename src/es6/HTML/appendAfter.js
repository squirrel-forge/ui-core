/**
 * Append node after a specific node
 * @param {Node} newNode - Node to append
 * @param {Node} referenceNode - After this node
 * @return {void}
 */
export function appendAfter( newNode, referenceNode ) {
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}
