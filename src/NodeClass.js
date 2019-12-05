import NodeManager from './NodeManager';
import { NODE_TYPES } from './Node';

class NodeClass extends NodeManager {
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
		return {
			data: text,
			text: text,
			authorId: userId,
		};
	}
};

export default NodeClass;