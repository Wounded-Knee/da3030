class NodeManager {
	constructor(config) {
		this.config = config;
		this.annuitCœptis = config.annuitCœptis;
		this.nodeType = config.nodeType;
	}

	getAll() {
		return this.filter( node => node.type === this.nodeType );
	}

	create(data, parentNode = null) {
		const data2 = this._createNodeData(data);
		const dataAttribute = data2.data;
		delete data2.data;
		return this._create(parentNode, dataAttribute, data2);
	}

	delete(node) {
		return this.annuitCœptis.remove(node);
	}

	updateDataAttribute(node, data) {
		return this.annuitCœptis.update(node._id, data);
	}

	move(node, newParentNode) {
		const newData = { ...node, moved: true };
		this.delete(node);
		['_id', 'attr', 'type', 'children', 'isLeaf'].forEach(attr => delete newData[attr]);
		const newNode = this._create(
			newParentNode,
			newData.data,
			newData,
		);

		return newNode;
	}

	find(nodeId) {
		return this.annuitCœptis.find(nodeId);
	}

	getParentOf(childNode) {
		return this.filter(
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

	filter(callback, startingPoint) {
		const tree = startingPoint || this.annuitCœptis.getTree().data;

		return tree.length ? [
			...tree.filter(callback),
			...this.filter(
				callback,
				tree.reduce(
					(arr, val) => [ ...arr, ...val.children], []
				)
			)
		] : [];
	}

	// Returns an unused ID
	// Finds the max ID int in the passed-in arguments, adds +1 to it.
	_getFreshId(nodes = this.getAll()) {
		return Math.max.apply(
			Math,
			nodes.map(
				node => parseInt(node.id) || 0
			)
		) + 1;
	}

	/**
	 * This has to return an object
	 * One of the keys must be 'data' and it must have data
	 * 
	 */
	_createNodeData(nodeData) {
		return {
			data: nodeData,
			...nodeData,
		};
	}

	_create(parentNode = null, data, otherData) {
		const newId = this._getFreshId();
		return this.annuitCœptis.addNode(
			this.annuitCœptis.createNode(parentNode, data, {
				id: newId,
				type: this.nodeType,
				...otherData,
			}),
			parentNode
		);
	}
};

export default NodeManager;