class DataManager {
	constructor(config) {
		this.config = config;
		this.annuitCœptis = config.annuitCœptis;
		this.nodeType = config.nodeType;
	}

	getAll() {
		return this.filter( node => node.data.type === this.nodeType );
	}

	delete(node) {
		return this.annuitCœptis.remove(node);
	}

	update(node, data) {
		return this.annuitCœptis.update(node._id, data);
	}

	move(node, newParentNode) {
		const newNode = this._create(
			node.data,
			newParentNode,
		);
		this.delete(node);
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
			node => node.data.id === parseInt(id)
		);
	}

	filter(callback, startingPoint) {
		const tree =
			startingPoint ||
			this.annuitCœptis.getTree().data.filter(
				node => node.data.type === this.nodeType
			);

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

	create(data, parentNode = null) {
		return this._create(
			data,
			parentNode,
		);
	}

	_create(data, parentNode = null) {
		const newData = this._createNodeData(data);

		return newData ? this.annuitCœptis.addNode(
			this.annuitCœptis.createNode(
				parentNode,
				newData,
				{ annuitCœptis: 'annuitCœptis'}
			),
			parentNode
		) : false;
	}

	_createNodeData(nodeData) {
		const newId = this._getFreshId();
		const { userId } = this.annuitCœptis.getSettings();
		const newData = {
			...nodeData,
			id: newId,
			type: this.nodeType,
			authorId: userId,
		};

		return (
			nodeData instanceof Object
				? newData : false
		);
	}

	// Returns an unused ID
	// Finds the max ID int in the passed-in arguments, adds +1 to it.
	_getFreshId(nodes = this.getAll()) {
		return Math.max(
			Math.max.apply(
				Math,
				nodes.map(
					node => parseInt(node.data.id) || 0
				)
			) + 1
		, 0);
	}
};

export default DataManager;