class NodeManager {
	constructor(config) {
		this.config = config;
		this.annuitCœptis = config.annuitCœptis;
		this.nodeType = config.nodeType;
	}

	getAll() {
		return this.annuitCœptis.getTaxNodesByType(this.nodeType);
	}

	create(nodeData) {
		return this.annuitCœptis.addTaxNode(
			this.nodeType,
			this._createNodeData(nodeData)
		);
	}

	move(node, newParentNode) {
		const newData = { ...node };
		this.annuitCœptis.remove(node);
		['_id', 'attr', 'type', 'children', 'isLeaf'].forEach(attr => delete newData[attr]);
		const newNode = this.annuitCœptis.addTaxNode(
			node.type,
			newData,
			newParentNode
		);

		return newNode;
	}

	getParentOf(childNode) {
		return this.annuitCœptis.filter(
			node => node.children.find(
				child => child._id === childNode._id
			)
		)[0];
	}

	getById(id) {
		return this.getAll().find(
			node => node.id === id
		);
	}

	_createNodeData(nodeData) {
		return {
			data: nodeData,
			...nodeData,
		};
	}
};

export default NodeManager;