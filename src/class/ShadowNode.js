import AbstractNode, { NODE_TYPES } from './AbstractNode';
const SHADOW_NODE_TYPES = {
	SHADOW_NODE_CATCHALL: 'catchall',
	SHADOW_NODE_SKIP: 'skip',
};
const NODE_TYPE = NODE_TYPES.NODE_TYPE_SHADOWNODE;

class ShadowNode extends AbstractNode {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPE;
	}

	getChildrenOf(parentNode) {
		const rv = super.getChildrenOf(parentNode).map(
			child => ({
				...child,
				data: {
					...child.data,
					text: 'xxx',
				}
			})
		);
		return rv;
	}

	shadow(node) {
		console.log([
			'shadow nodes created: ',
			this.create({ parentNodeId: node.data.id, shadowNodeType: SHADOW_NODE_TYPES.SHADOW_NODE_CATCHALL}),
			this.create({ parentNodeId: node.data.id, shadowNodeType: SHADOW_NODE_TYPES.SHADOW_NODE_SKIP}),
		]);
	}
};

export {
	SHADOW_NODE_TYPES,
	ShadowNode as default,
};
