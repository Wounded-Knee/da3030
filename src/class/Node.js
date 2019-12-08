import DataManager from './DataManager';
const NODE_TYPES = {
  NODE_TYPE_USER: 'user',
  NODE_TYPE_RESPONSE_GROUP: 'responseGroup',
  NODE_TYPE_NODE: 'node',
  NODE_TYPE_POLICY: 'policy',
  NODE_TYPE_CERTIFICATION: 'certification',
  NODE_TYPE_CLOUD: 'cloud',
  NODE_TYPE_TRACK: 'track',
};

class Node extends DataManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_NODE;
	}

	getByAuthorId(authorId) {
		return this.filter(
			node =>
				node.data.authorId === authorId
		);
	}

	/**
	 * Returns the node at the start of this track
	 **/
	getTrailhead(childNode) {
		const parentNode = this.getParentOf(childNode);

		return parentNode === undefined
			? childNode
			: this.getTrailhead(parentNode)
	}

	move(node, newParentNode) {
		return super.move({ data: node.data.text }, newParentNode);
	}

	_createNodeData(text) {
		return text !== undefined
			? super._createNodeData({
				text,
			}) : false;
	}
};

export {
  NODE_TYPES,
  Node as default
};