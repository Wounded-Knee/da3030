const tax = require('taxonomy').tax;
const localStorageName = 'AnnuitCœptis';
const localStorageSettingsName = 'da3000';
var settings = {};

class AnnuitCœptis {
	constructor(config) {
		this.config = config;

		// Method aliases
		[
			'addNode',
			'createNode',
			'insert',
			'path',
			'update',
			'find',
			'remove',
			'getTree',
			'setTree',
		].forEach(
			methodName => this[methodName] = function() {
				const rv = tax[methodName].apply(tax, arguments);
				if ([
					'update',
					'addNode',
					'remove',
					'insert'
				].indexOf(methodName) !== -1) {
					this.signalChange();
				}
				return rv;
			}
		);

		this.tax = tax;
		this.load();
	}

	signalChange() {
		this.config.onChange();
		this.persist();
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
	}

	/**
	 * Adds a user to the DB
	 * Returns the user record
	 **/
	addUser(username) {
		const users = this.getUsers();
		const newUserId = Math.max.apply( Math, users.map( user => parseInt(user.id) || 0 ) ) + 1;

		return this.addNode(
			this.createNode(null, username, {
				id: newUserId,
				type: 'user',
				name: username,
			})
		);
	}

	setCurrentUser(userId) {
		const oldUser = this.getCurrentUser();
		const freshUser = this.getUserById(userId);
		settings.userId = userId;
		this.signalChange();
	}

	getCurrentUser() {
		return this.getUsers().find( node => node.id === settings.userId );
	}

	getUsers() {
		return this.filter( node => node.type === 'user' );
	}

	getUserById(userId) {
		return this.getUsers().find( node => node.id === userId );
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

	add(text, parentNode) {
		const newNodeData = {
			"data": text,
			"type": "node",
			"text": text,
			"authorId": settings.userId,
		};
		return this.addNode(
			newNodeData,
			parentNode || null,
		);
	}

	delete(node) {
		console.log('Removing ', node);
		this.remove(node._id);
	}

	data() {
		const data = this.getTree().data;
		console.log(data);
		return data;
	}
};

export default AnnuitCœptis;