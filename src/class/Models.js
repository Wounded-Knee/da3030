const MODEL_TYPES = {
	GENERIC: 'Generic',
	CLOWN: 'Clown',
};
const EVENT_TYPES = {
	CREATED: 'Created',
	SERIALIZED: 'Serialized',
	DESERIALIZED: 'Deserialized',
	SET_DATA_OBJ: 'Set Data by Object',
	SET_DATA: 'Set Data by Attribute',
	DELETED: 'Deleted',
	ADOPTEDBY: 'Adopted By',
	ADOPTED: 'Adopted',
	ORPHANED: 'Orphaned',
	SAVED: 'Saved',
};
const ATTRIBUTE_NAMES = {
	META: '_meta',
	MODEL_TYPE: 'modelName',
	ID: 'id',
	PARENT_ID: 'parentId',
};

class Generic {
	constructor(data, annuitCœptisII) {
		this.annuitCœptisII = annuitCœptisII;
		this.deserialize(data);
		this.dirty = false;
	}

	getModelType() {
		return MODEL_TYPES.GENERIC;
	}

	get(attribute) {
		return attribute ? this.data[attribute] : this.data;
	}

	set(value, attributeName = undefined) {
		if (!attributeName) {
			if (!this.isValidDataObject(value)) {
				throw new Error(`${this.getModelType()}.set(): Invalid data object provided.`);
				return false;
			} else {
				this.recordEvent(EVENT_TYPES.SET_DATA_OBJ, value);
				return this.deserialize(value);
			}
		} else {
			if (!this.isValidAttributeValue(value, attributeName)) {
				throw new Error(`${this.getModelType()}.set(): Invalid data attribute value provided.`);
				return false;
			} else {
				this.recordEvent(EVENT_TYPES.SET_DATA, {value, attributeName});
				this.data[attributeName] = value;
				return true;
			}
		}
	}

	setParent(parentNode) {
		const parentNodeId = parentNode.getId();
		if (parentNodeId !== undefined) {
			this.metaData[ATTRIBUTE_NAMES.PARENT_ID] = parentNodeId;
			this.recordEvent(EVENT_TYPES.ADOPTEDBY, parentNodeId);
			return true;
		}
		return false;
	}

	orphan() {
		delete this.metaData[ATTRIBUTE_NAMES.PARENT_ID];
		this.recordEvent(EVENT_TYPES.ORPHANED);
		return true;
	}

	getChildren() {
		const getParentId = childNode => {
			const parentNode = childNode.getParent();
			return parentNode ? parentNode.getId() : false;
		};
		return this.annuitCœptisII.filter(
			node => getParentId(node) === this.getId()
		);
	}

	getParent() {
		return this.annuitCœptisII.getById(
			this.metaData[ATTRIBUTE_NAMES.PARENT_ID]
		);
	}

	isValidDataObject(dataObject) {
		return dataObject instanceof Object &&
			typeof(dataObject) === 'object' &&
			!(dataObject instanceof Array);
	}

	isValidAttributeValue(attributeValue, attributeName) {
		return true;
	}

	isDirty() {
		return this.dirty;
	}

	getId() {
		return this.metaData[ATTRIBUTE_NAMES.ID];
	}

	delete() {
		this.recordEvent(EVENT_TYPES.DELETED);
		return true;
	}

	save() {
		const nodeData = this.serialize();
		this.recordEvent(EVENT_TYPES.SAVED);
		this.dirty = false;
		return nodeData;
	}

	serialize() {
		this.recordEvent(EVENT_TYPES.SERIALIZED);
		return {
			...this.data,
			[ATTRIBUTE_NAMES.META]: {
				...this.metaData,
				[ATTRIBUTE_NAMES.MODEL_TYPE]: this.getModelType(),
			}
		};
	}

	deserialize(data) {
		this.data = {};
		this.metaData = {
			events: [],
		};
		if (data) {
			const metaData = data[ATTRIBUTE_NAMES.META];
			this.data = data;
			if (metaData) {
				const modelName = metaData[ATTRIBUTE_NAMES.MODEL_TYPE];
				if (modelName !== this.getModelType()) {
					throw new Error(`${this.getModelType()}.deserialize() Wrong model type: ${modelName}`);
					return false;
				}
				this.metaData = {
					...metaData,
					events: [
						...metaData.events || [],
					]
				};
				delete this.data[ATTRIBUTE_NAMES.META];
			} else {
				throw new Error(`${this.getModelType()}.deserialize() No metadata`, data);
				return false;
			}
		}
		this.recordEvent(EVENT_TYPES.DESERIALIZED)
		return this.data;
	}

	recordEvent(eventType, eventData) {
		if (Object.values(EVENT_TYPES).indexOf(eventType) === -1) {
			throw new Error(`${this.getModelType()}.recordEvent() Can't record an invalid eventType: ${eventType}`);
			return false;
		}

		const newEvent = {
			userId: 0,
			date: new Date(),
			type: eventType,
			data: eventData,
		};
		this.metaData.events.push(newEvent);
		if (this.isEventDirty(eventType)) this.dirty = true;
		return newEvent;
	}

	// Returns true if this type of event
	// has the effect of dirtying the model state
	isEventDirty(eventType) {
		return [
			EVENT_TYPES.CREATED,
			EVENT_TYPES.SET_DATA_OBJ,
			EVENT_TYPES.SET_DATA,
			EVENT_TYPES.DELETED,
			EVENT_TYPES.ADOPTED,
			EVENT_TYPES.ADOPTEDBY,
			EVENT_TYPES.ORPHANED,
		].indexOf(eventType) !== -1;
	}

	getEventsByType(eventType) {
		return this.metaData.events.filter(
			event => event.type === eventType
		);
	}
}

class Clown extends Generic {
	getModelType() {
		return MODEL_TYPES.CLOWN;
	}
}

export {
	MODEL_TYPES,
	EVENT_TYPES,
	ATTRIBUTE_NAMES,
	Generic,
	Clown,
}