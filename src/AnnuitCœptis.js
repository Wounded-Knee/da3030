const tax = require('taxonomy').tax;
const localStorageName = 'AnnuitCœptis';

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
					this.config.onChange();
					this.persist();
				}
				return rv;
			}
		);

		this.tax = tax;
		this.load();
	}

	persist() {
		localStorage.setItem(localStorageName, JSON.stringify(this.getTree()));
	}

	load() {
		const storageData = localStorage.getItem(localStorageName);
		if (storageData) this.setTree(JSON.parse(storageData));
	}

	/**
	 * Adds a user to the DB
	 * Returns the user record
	 **/
	addUser(username) {
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

	add(text, parentNode) {
		this.addNode(
			this.createNode(null, text),
			parentNode || undefined
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