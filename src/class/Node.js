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
				node.authorId === authorId
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

	_createNodeData(text) {
		const { userId } = this.annuitCœptis.getSettings();

		if (
			userId === undefined ||
			text === undefined
		) return false;

		return {
			data: text,
			text: text,
			authorId: userId,
		};
	}
};

export {
  NODE_TYPES,
  Node as default
};