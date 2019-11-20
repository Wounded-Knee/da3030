const tax = require('taxonomy').tax;

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
		].forEach(
			methodName => this[methodName] = function() {
				if (['update'].indexOf(methodName) !== -1) {
					this.config.onChange();
				}
				return tax[methodName].apply(tax, arguments);
			}
		);
	}

	data() {
		const data = tax.getTree().data;
		console.log(data);
		return data;
	}
};

export default AnnuitCœptis;