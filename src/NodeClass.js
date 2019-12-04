import NodeManager from './NodeManager';
import { NODE_TYPES } from './Node';

class NodeClass extends NodeManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_NODE;
	}

	create(text, parentNode = null) {
		const { userId } = this.annuitCœptis.getSettings();
		const data = {
			authorId: userId,
			data: text,
			text: text,
		};
		return super.create(data, parentNode);
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
};

export default NodeClass;