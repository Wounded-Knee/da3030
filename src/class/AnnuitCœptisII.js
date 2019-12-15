import * as Models from './Models';
const { MODEL_TYPES, ATTRIBUTE_NAMES } = Models;
var AnnuitCœptisIIData = [];

class AnnuitCœptisII {
	constructor({ loadFile } = {}) {
		this.iterator = 0;
		this.dirty = false;
		this.load(loadFile);
		this.models = {
			[MODEL_TYPES.GENERIC]: Models[MODEL_TYPES.GENERIC],
		};
	}

	create(data, modelType = MODEL_TYPES.GENERIC) {
		const model = Models[modelType];
		const newNode = new model({
			...data,
			[ATTRIBUTE_NAMES.META]: {
				[ATTRIBUTE_NAMES.ID]: this.iterator++,
				[ATTRIBUTE_NAMES.MODEL_TYPE]: modelType,
			},
		}, this);
		AnnuitCœptisIIData.push(newNode);
		this.dirty = true;
		return newNode;
	}

	getById(id) {
		return this.filter(
			node => node.getId() === id
		)[0];
	}

	filter(callback) {
		return AnnuitCœptisIIData.filter(callback);
	}

	map(callback) {
		return AnnuitCœptisIIData.map(callback);
	}

	isDirty() {
		return this.dirty || this.map(
			node => node.isDirty()
		).reduce(
			(accumulator, value) => accumulator || value,
			this.dirty,
		);
	}

	save(file = 'AnnuitCœptisII') {
		const serializedData = this.map(
			node => node.save()
		);
		localStorage.setItem(file, JSON.stringify(serializedData));
		this.dirty = false;
	}

	load(file = 'AnnuitCœptisII') {
		AnnuitCœptisIIData = (JSON.parse(localStorage.getItem(file)) || []).map(
			nodeData => {
				const modelType = nodeData[ATTRIBUTE_NAMES.META][ATTRIBUTE_NAMES.MODEL_TYPE];
				const model = Models[modelType];
				return new model(nodeData, this);
			}
		);
		this.dirty = false;
		this.iterator = this._getFreshId();
	}

	// Force flag, when true, will clear even if dirty.
	// Otherwise, dirty flag acts as a safety.
	clear(force = false) {
		if (this.isDirty() && !force) {
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