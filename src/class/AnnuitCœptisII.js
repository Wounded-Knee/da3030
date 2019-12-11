import * as Models from './Models';
const { MODEL_TYPES } = Models;
const AnnuitCœptisIIData = [];

class AnnuitCœptisII {
	constructor({ loadFile } = {}) {
		this.iterator = 0;
		this.dirty = false;
		this.load(loadFile);
	}

	create(data, modelType = MODEL_TYPES.GENERIC) {
		const model = Models[modelType];
		const newNode = new model({
			...data,
			meta: {
				id: this.iterator++,
			},
		});
		AnnuitCœptisIIData.push(newNode);
		this.dirty = true;
		return newNode;
	}

	filter(callback) {
		return AnnuitCœptisIIData.filter(callback);
	}

	isDirty() {
		return this.dirty;
	}

	save(file = 'AnnuitCœptisII') {
		localStorage.setItem(file, JSON.stringify(AnnuitCœptisIIData));
		this.dirty = false;
	}

	load(file = 'AnnuitCœptisII') {
		localStorage.getItem(file, JSON.stringify(AnnuitCœptisIIData));
		this.iterator = this._getFreshId();
	}

	getData() {
		return AnnuitCœptisIIData;
	}

	_getFreshId(nodes = AnnuitCœptisIIData) {
		return Math.max(
			Math.max.apply(
				Math,
				nodes.map(
					node => parseInt(node.id) || 0
				)
			) + 1
		, 0);
	}
}

export default AnnuitCœptisII;