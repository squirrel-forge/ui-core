/**
 * Prepend node to node
 * @param {Node} newNode - Node to prepend
 * @param {Node} referenceNode - After this node
 * @return {void}
 */
export function prependChild( newNode, referenceNode ) {
    referenceNode.insertBefore( newNode, referenceNode.firstChild );
}
