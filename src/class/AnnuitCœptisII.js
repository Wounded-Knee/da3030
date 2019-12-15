import * as Models from './Models';
import { LOCAL_STORAGE_NAMES } from '../PROPHET60091';
const {
	MODEL_TYPES,
	ATTRIBUTE_NAMES,
	User
} = Models;
var AnnuitCœptisIIData = [];

class AnnuitCœptisII {
	constructor({ loadFile, onChange } = {}) {
		this.iterator = 0;
		this.dirty = false;
		this.onChange = onChange || function() {};
		this.load(loadFile);
		this.models = Models;
	}

	somethingChanged(model = undefined) {
		this.onChange();
	}

	create(data, modelType = MODEL_TYPES.GENERIC) {
		const model = Models[modelType];
		if (model) {
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
		} else {
			console.log(Models);
			throw new Error(`${modelType} does not exist.`);
		}
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

	getById(id) {
		return this.filter(
			node => node.getId() === id
		)[0];
	}

	getData() {
		return AnnuitCœptisIIData;
	}

	getNotifications(notificationType) {
		return [];
	}

	getCurrentUser() {
		return (this.getByModelType(MODEL_TYPES.USER).filter(
			user => user.isCurrent()
		)[0]) || User.getAnonymous();
	}

	getTrailheads() {
		return this.getByModelType(MODEL_TYPES.TEXT_NODE).filter(
			textNode => !textNode.getParent()
		);
	}

	getByModelType(modelType) {
		return this.filter(
			node => node.getModelType() === modelType
		);
	}

	getLocalStorageInfo() {
		return {
			storageData: this.getLocalStorage(LOCAL_STORAGE_NAMES.DATA)
		};
	}

	getLocalStorage(fileName) {
		return JSON.parse(localStorage.getItem(fileName) || '{}');
	}

	setLocalStorage(fileName, data) {
		localStorage.setItem(
			fileName,
			JSON.stringify(data),
		);
		const newValue = this.getLocalStorage(fileName);
		console.log('setLocalStorage() ', newValue);
		return newValue;
	}

	represent() {
		return this.map(model => model.represent());
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

export {
	AnnuitCœptisII as default,
	LOCAL_STORAGE_NAMES,
};