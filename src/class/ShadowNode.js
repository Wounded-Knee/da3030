import AbstractNode, { NODE_TYPES } from './AbstractNode';
const SHADOW_NODE_TYPES = {
	SHADOW_NODE_CATCHALL: 'catchall',
};
const NODE_TYPE = NODE_TYPES.NODE_TYPE_SHADOWNODE;
const SHADOW_NODE_TYPE = SHADOW_NODE_TYPES.SHADOW_NODE_CATCHALL;

class ShadowNode extends AbstractNode {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPE;
		this.shadowNodeType = SHADOW_NODE_TYPE;
	}

	getChildrenOf(parentNode) {
		const rv = super.getChildrenOf(parentNode).map(
			child => ({
				...child,
				data: {
					...child.data,
					text: '...',
				}
			})
		);
		return rv;
	}

	shadow(node) {
		console.log(`Shadowing ${node.data.text}`);
		const rv = this.create({
			shadowNodeType: SHADOW_NODE_TYPES.SHADOW_NODE_CATCHALL,
		}, node);
		console.log('shadow', rv);
		return rv;
	}

	_createNodeData(data) {
		return super._createNodeData({
			shadowNodeType: this.shadowNodeType,
		});
	}
};

export {
	SHADOW_NODE_TYPES,
	ShadowNode as default,
};
