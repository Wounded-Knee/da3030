const MODEL_TYPES = {
	GENERIC: 'Generic',
	CLOWN: 'Clown',
};
const EVENT_TYPES = {
	CREATED: 'Created',
	SERIALIZED: 'Serialized',
	DESERIALIZED: 'Deserialized',
};
const ATTRIBUTE_NAMES = {
	META: '_meta',
	MODEL_TYPE: 'modelName',
};

class Generic {
	constructor(data) {
		this.deserialize(data);
	}

	getModelType() {
		return MODEL_TYPES.GENERIC;
	}

	get(attribute) {
		return attribute ? this.data[attribute] : this.data;
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
		return newEvent;
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