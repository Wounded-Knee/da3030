class DataManager {
	constructor(config) {
		this.config = config;
		this.annuitCœptis = config.annuitCœptis;
		this.nodeType = config.nodeType;
	}

	getAll() {
		return this.filter( node => node.data.type === this.nodeType );
	}

	getTrailheads() {
		return this.filter( node => !node.isLeaf );
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
		this.onMove(node, newNode);
		return newNode;
	}

	find(nodeTaxId) {
		return this.annuitCœptis.find(nodeTaxId);
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

	getParentOf(childNode) {
		return this.filter(
			node => node.children.find(
				child => child._id === childNode._id
			)
		)[0];
	}

	getChildrenOf(parentNode) {
		return parentNode.children.filter(
			child => child.data.type === this.nodeType
		);
	}

	getById(id) {
		return this.getAll().find(
			node => node.data.id === parseInt(id)
		);
	}

	create(data, parentNode = null) {
		const newNode = this._create(
			data,
			parentNode,
		);
		this.onCreate(newNode);
		return newNode;
	}

	// Override available
	onCreate(newNode) {
		return this.config.onCreate ? this.config.onCreate(newNode) : newNode => newNode;
	}

	onMove(oldNode, newNode) {
		return;
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