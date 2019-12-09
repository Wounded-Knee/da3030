import AbstractNode, { NODE_TYPES } from './AbstractNode';
import { SHADOW_NODE_TYPES } from './ShadowNode';
const NODE_TYPE = NODE_TYPES.NODE_TYPE_NODE;

class Node extends AbstractNode {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPE;
	}

	_createNodeData(text) {
		return text !== undefined
			? super._createNodeData({
				text,
			}) : false;
	}
};

export default Node;
