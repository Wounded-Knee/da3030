const MODEL_TYPES = {
	GENERIC: 'Generic',
	CLOWN: 'Clown',
};
const EVENT_TYPES = {
	CREATED: 'Created',
	SERIALIZED: 'Serialized',
	DESERIALIZED: 'Deserialized',
};

class Generic {
	constructor(data) {
		this.data = data;
		this.modelName = MODEL_TYPES.GENERIC;

		this.data = {
			...data,
			meta: {
				...this.data.meta,
				modelName: this.modelName,
				events: [
					...this.data.meta.events || [],
					{
						userId: 0,
						date: new Date(),
						type: EVENT_TYPES.CREATED,
					}
				],
			}
		};
	}

	get(attribute) {
		return attribute ? this.data[attribute] : this.data;
	}

	serialize() {
		return {
			...this.data,
			meta: {
				...this.data.meta,
				events: [
					...this.data.meta.events,
					{
						userId: 0,
						date: new Date(),
						type: EVENT_TYPES.SERIALIZED,
					}
				],
			}
		};
	}

	deserialize(data) {
		this.data = {
			...data,
			meta: {
				...data.meta,
				events: [
					...data.meta.events,
					{
						userId: 0,
						date: new Date(),
						type: EVENT_TYPES.DESERIALIZED,
					}
				],
			}
		};
		return this.data;
	}
}

class Clown extends Generic {
	constructor(data) {
		const rv = super(data);
		this.modelName = MODEL_TYPES.CLOWN;
		return rv;
	}
}

export {
	MODEL_TYPES,
	EVENT_TYPES,
	Generic,
	Clown,
}