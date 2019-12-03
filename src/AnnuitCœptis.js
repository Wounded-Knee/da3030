import { NODE_TYPES } from './Node';
import Policy from './Policy';
import Certification from './Certification';
import User from './User';
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

		const args = {
			annuitCœptis: this,
		};
		this.tax = tax;
		this.Policy = new Policy(args);
		this.Certification = new Certification(args);
		this.User = new User(args);
		this.load();
	}

	// Extension of tax() method
	remove(node) {
		var rv = this.tax.remove(node._id);
		console.log('remove() ', rv, node);
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
		const { storageData } = this.getLocalStorageInfo();
		const storageSettings = localStorage.getItem(localStorageSettingsName);

		if (storageData) this.setTree(JSON.parse(storageData));
		if (storageSettings) settings = JSON.parse(storageSettings);

		document.getElementsByTagName('html')[0].className = settings.bossMode ? 'bossMode' : '';
	}

	getLocalStorageInfo() {
		const storageData = localStorage.getItem(localStorageName);
		return {
			storageData: storageData,
		}
	}

	getCurrentUser() {
		return this.User.getById( settings.userId );
	}

	setCurrentUser(userId) {
		settings.userId = userId;
		this.signalChange();
	}

	toggleBossMode() {
		settings.bossMode = !settings.bossMode;
		this.signalChange();
		document.getElementsByTagName('html')[0].className = settings.bossMode ? 'bossMode' : '';
	}

	addNewNode(text, parentNode = null) {
		return this.addTaxNode(NODE_TYPES.NODE_TYPE_NODE, {
			authorId: settings.userId,
			data: text,
			text: text,
		}, parentNode);
	}

	move(node, newParentNode) {
		if (node.type !== 'node') console.warn('Still calling legacy AnnuitCœptis.move() for type ', node.type);
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

	/**
	 * Returns the node at the start of this track
	 **/
	getTrailhead(childNode) {
		const parentNode = this.getParentNode(childNode);

		return parentNode === undefined
			? childNode
			: this.getTrailhead(parentNode)
	}

	delete(node) {
		this.remove(node);
	}
};

export default AnnuitCœptis;