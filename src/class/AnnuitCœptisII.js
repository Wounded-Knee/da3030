import * as Models from './Models';
const { MODEL_TYPES, ATTRIBUTE_NAMES } = Models;
var AnnuitCœptisIIData = [];

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
			[ATTRIBUTE_NAMES.META]: {
				[ATTRIBUTE_NAMES.ID]: this.iterator++,
				[ATTRIBUTE_NAMES.MODEL_TYPE]: modelType,
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
		const serializedData = AnnuitCœptisIIData.map(
			node => node.serialize()
		);
		localStorage.setItem(file, JSON.stringify(serializedData));
		this.dirty = false;
	}

	load(file = 'AnnuitCœptisII') {
		this.loadedData = JSON.parse(localStorage.getItem(file)) || [];
		AnnuitCœptisIIData = this.loadedData.map(
			nodeData => {
				const modelType = nodeData[ATTRIBUTE_NAMES.META][ATTRIBUTE_NAMES.MODEL_TYPE];
				const model = Models[modelType];
				return new model(nodeData);
			}
		);
		this.dirty = false;
		this.iterator = this._getFreshId();
	}

	// Force flag, when true, will clear even if dirty.
	// Otherwise, dirty flag acts as a safety.
	clear(force = false) {
		if (this.dirty && !force) {
			return false;
		}
		AnnuitCœptisIIData.length = 0;
		this.dirty = false;
		return true;
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