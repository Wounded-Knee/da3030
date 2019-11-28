import { NODE_TYPES } from './Node';
const tax = require('taxonomy').tax;
const localStorageName = 'AnnuitCœptis';
const localStorageSettingsName = 'da3000';
const taxMethodsToAlias = [
	'addNode',
	'createNode',
	'insert',
	'path',
	'update',
	'find',
	'getTree',
	'setTree',
];
const taxMethodsCausingChanges = [
	'update',
	'addNode',
	'insert'
];
var settings = {
	userId: undefined,
	bossMode: false,
};

class AnnuitCœptis {
	constructor(config) {
		this.config = config;

		// Method aliases
		taxMethodsToAlias.forEach(
			methodName => this[methodName] = function() {
				const rv = tax[methodName].apply(tax, arguments);
				if (taxMethodsCausingChanges.indexOf(methodName) !== -1) {
					this.signalChange();
				}
				return rv;
			}
		);

		this.tax = tax;
		this.load();
	}

	// Extension of tax() method
	remove(node) {
		var rv = this.tax.remove(node._id);
		this.signalChange();
		return rv;
	}

	signalChange() {
		this.persist();
		this.config.onChange();
	}

	persist() {
		localStorage.setItem(localStorageName, JSON.stringify(this.getTree()));
		localStorage.setItem(localStorageSettingsName, JSON.stringify(settings));
	}

	load() {
		const storageData = localStorage.getItem(localStorageName);
		const storageSettings = localStorage.getItem(localStorageSettingsName);

		if (storageData) this.setTree(JSON.parse(storageData));
		if (storageSettings) settings = JSON.parse(storageSettings);

		document.getElementsByTagName('html')[0].className = settings.bossMode ? 'bossMode' : '';
	}

	/**
	 * Adds a user to the DB
	 * Returns the user record
	 **/
	addUser(username) {
		const data = {
			name: username,
			data: username,
		};

		return this.addTaxNode(NODE_TYPES.NODE_TYPE_USER, data);
	}

	setCurrentUser(userId) {
		const oldUser = this.getCurrentUser();
		const freshUser = this.getUserById(userId);
		settings.userId = userId;
		this.signalChange();
	}

	toggleBossMode() {
		settings.bossMode = !settings.bossMode;
		this.signalChange();
		document.getElementsByTagName('html')[0].className = settings.bossMode ? 'bossMode' : '';
	}

	getCurrentUser() {
		return this.getUsers().find( node => node.id === settings.userId );
	}

	getUsers() {
		return this.getTaxNodesByType(NODE_TYPES.NODE_TYPE_USER);
	}

	getUserById(userId) {
		return this.getUsers().find( node => node.id === userId );
	}

	addNewNode(text, parentNode = null) {
		return this.addTaxNode(NODE_TYPES.NODE_TYPE_NODE, {
			authorId: settings.userId,
			data: text,
			text: text,
		}, parentNode);
	}

	/**
	 * Creates a response group under parentNode
	 * Moves the given list of extant child nodes under the new response group
	 **/
	addResponseGroup(data, parentNode) {
		if (!parentNode) {
			return new Error('Cannot add a responseGroup without a parentNode');
		}
		const newResponseGroup = this.addTaxNode(NODE_TYPES.NODE_TYPE_RESPONSE_GROUP, data, parentNode);

	}

	moveNodeIntoResponseGroup(node, responseGroup) {
		this.move.apply(arguments);
	}

	move(node, newParentNode) {
		const newData = { ...node };
		this.remove(node);
		['_id', 'attr', 'type', 'children', 'isLeaf'].forEach(attr => delete newData[attr]);
		const newNode = this.addTaxNode(
			node.type,
			newData,
			newParentNode
		);

		return newNode;
	}

	getResponseGroups() {
		return this.getTaxNodesByType(NODE_TYPES.NODE_TYPE_RESPONSE_GROUP);
	}

	getResponseGroupsByParentNode(parentNode) {
		return this.filter(
			node =>
				node.type === NODE_TYPES.NODE_TYPE_RESPONSE_GROUP
				&& node.parentNodeId
		);
	}

	getTaxNodesByType(nodeType) {
		return this.filter( node => node.type === nodeType );
	}

	addTaxNode(nodeType, data, parentNode = null) {
		const newId = this.getFreshId(this.getTaxNodesByType(nodeType));

		return this.addNode(
			this.createNode(parentNode, data.data, {
				id: newId,
				type: nodeType,
				...data
			}),
			parentNode
		);
	}

	// Returns an unused ID
	// Finds the max ID int in the passed-in arguments, adds +1 to it.
	getFreshId(nodes) {
		return Math.max.apply(
			Math,
			nodes.map(
				node => parseInt(node.id) || 0
			)
		) + 1;
	}

	filter(callback, startingPoint) {
		const tree = startingPoint || this.getTree().data;

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

	getParentNode(childNode) {
		return this.filter( node => node.children.find( child => child._id === childNode._id ) )[0];
	}

	delete(node) {
		console.log('Removing ', node);
		this.remove(node._id);
	}
};

export default AnnuitCœptis;