import { LOCAL_STORAGE_NAMES } from '../PROPHET60091';

const MODEL_TYPES = {
	GENERIC: 'Generic',
	CLOWN: 'Clown',
	USER: 'User',
	TEXT_NODE: 'TextNode',
	CLOUD_NOTIFICATION: 'CloudNotification',
	HOME_NOTIFICATION: 'HomeNotification',
	USER_NOTIFICATION: 'UserNotification',
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
	TRACK: 'Track',
};
const ATTRIBUTE_NAMES = {
	META: '_meta',
	MODEL_TYPE: 'modelName',
	ID: 'id',
	PARENT_ID: 'parentId',
	AUTHOR_ID: 'authorId',
	NEW: 'new',
};

/**
 * Creation of a new Generic() model requires
 * a payload of initial data, and a link to
 * the desired annuitCœptisII instance.
 *
 * The payload, at bare minimum, must contain
 *   {
 *     [ATTRIBUTE_NAMES.META]: {
 *       [ATTRIBUTE_NAMES.ID]: int
 *     }
 *   }
 *
 * Descendant clases may impose further
 * requirements at their discretion.
 **/
class Generic {
	constructor(data, annuitCœptisII) {
		this.annuitCœptisII = annuitCœptisII;
		this.set(data);
		this.dirty = false;
	}

	onChange() {
		if (this.annuitCœptisII) this.annuitCœptisII.somethingChanged(this);
	}

	getModelType() {
		return MODEL_TYPES.GENERIC;
	}

	get(attribute) {
		return attribute ? this.data[attribute] : this.data;
	}

	onCreate() {
		return false;
	}

	set(value, attributeName = undefined) {
		const currentUserId = this.annuitCœptisII
			? this.annuitCœptisII.getCurrentUser().getId()
			: -1
		if (!attributeName) {
			if (!this.isValidDataObject(value)) {
				throw new Error(`${this.getModelType()}.set(): Invalid data object provided.`);
			} else {
				const metaData = this.metaData || value[ATTRIBUTE_NAMES.META];
				const authorId = metaData[ATTRIBUTE_NAMES.AUTHOR_ID] !== undefined
					? metaData[ATTRIBUTE_NAMES.AUTHOR_ID]
					: currentUserId;
				if (metaData) {
					var eventType;
					const modelName = metaData[ATTRIBUTE_NAMES.MODEL_TYPE] || this.getModelType();
					if (modelName !== this.getModelType()) {
						throw new Error(`${this.getModelType()}.set() Wrong model type: ${modelName}`);
					}

					if (metaData[ATTRIBUTE_NAMES.NEW]) {
						delete metaData[ATTRIBUTE_NAMES.NEW];
						eventType = EVENT_TYPES.CREATED;
					} else {
						eventType = this.metaData ? EVENT_TYPES.SET_DATA_OBJ : EVENT_TYPES.DESERIALIZED;
					}

					this.metaData = {
						...metaData,
						[ATTRIBUTE_NAMES.AUTHOR_ID]: authorId,
						events: [
							...metaData.events || [],
						]
					};
					
					delete value[ATTRIBUTE_NAMES.META];
					this.data = value;
					/**
					 * The thread must fork here, so that
					 * annuitCœptisII can push this new model
					 * into its array. The recordEvent() chain
					 * culminates in annuitCœptisII.somethingChanged()
					 * which immediately saves all data in that array.
					 *
					 * Hence setTimeout(). This should be a Promise
					 * instead, but not yet.
					 **/
					setTimeout(
						this.recordEvent.bind(this, eventType, value),
						50
					);
					if (eventType === EVENT_TYPES.CREATED) this.onCreate();
					return true;
				} else {
					throw new Error(`${this.getModelType()}.set() No metadata`, value);
				}
			}
		} else {
			if (!this.isValidAttributeValue(value, attributeName)) {
				throw new Error(`${this.getModelType()}.set(): Invalid data attribute value provided.`);
			} else {
				this.recordEvent(EVENT_TYPES.SET_DATA, {value, attributeName});
				this.data[attributeName] = value;
				return true;
			}
		}
	}

	track() {
		return this.recordEvent(EVENT_TYPES.TRACK);
	}

	setParent(parentNode = undefined) {
		if (parentNode) {
			const parentNodeId = parentNode.getId();
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

	isValidAttributeValue(attributeValue, attributeName) {
		return true;
	}

	isDirty() {
		return this.dirty;
	}

	getId() {
		return this.getMetaData(ATTRIBUTE_NAMES.ID);
	}

	getAuthorId() {
		return this.getMetaData(ATTRIBUTE_NAMES.AUTHOR_ID);
	}

	getMetaData(attr) {
		return this.metaData[attr];
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

	recordEvent(eventType, eventData) {
		const userId = this.annuitCœptisII
			? this.annuitCœptisII.getCurrentUser().getId()
			: -1;
		if (Object.values(EVENT_TYPES).indexOf(eventType) === -1) {
			throw new Error(`${this.getModelType()}.recordEvent() Can't record an invalid eventType: ${eventType}`);
		}

		const newEvent = {
			userId: userId,
			date: new Date(),
			type: eventType,
			data: eventData,
		};
		this.metaData.events.push(newEvent);
		if (this.isEventDirty(eventType)) {
			this.dirty = true;
			this.onChange();
		}
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

	getEvents() {
		return this.metaData.events;
	}

	getEventsByType(eventType) {
		return this.getEvents().filter(
			event => event.type === eventType
		);
	}

	/**
	 * Validator
	 * Returns true if the given object meets
	 * this model's requirements.
	 **/
	isValidDataObject(data) {
		if (data instanceof Object &&
			typeof(data) === 'object' &&
			!(data instanceof Array)
		) {
			const dataKeys = Object.keys(data);
			const requiredKeys = this.getValidDataObjectKeys();
			const requiredKeysWhichWereProvided = requiredKeys.filter(
				requiredKey => 
					dataKeys.includes(requiredKey)
			);
			const unknownKeys = dataKeys.filter(
				providedKey => 
					!requiredKeys.includes(providedKey)
			);
			if (
				requiredKeysWhichWereProvided.length === requiredKeys.length &&
				unknownKeys.length === 0
			) {
				return true;
			} else {
				if (unknownKeys.length > 0) {
					console.error(data);
					console.warn(
						`${this.getModelType()}.isValidDataObject() received invalid keys: `, unknownKeys
					);
				}
				if (requiredKeysWhichWereProvided.length !== requiredKeys.length) {
					console.warn(requiredKeysWhichWereProvided, requiredKeys);
				}
				return false;
			};
		} else {
			console.warn(
				`${this.getModelType()}.isValidDataObject() was called with shit data, boss.`
			);
			return false;
		}
	}

	/**
	 * Returns a string describing this model's
	 * model type and data... for debugging.
	 **/
	represent() {
		return `${this.getModelType()} ${this.getCardinalValue()}`;
	}

	/**
	 * Returns one of this model's values
	 * which best represents the entire model
	 **/
	getCardinalValue() {
		return this.getId();
	}

	/**
	 * Data object validator.
	 * 
	 * Returns an array of object keys
	 * which constitute required
	 * first-level attributes of a data object
	 * which can be used to instance this
	 * model.
	 *
	 * Data objects which are passed to the
	 * constructor must contains all of these
	 * keys in order to be accepted.
	 **/
	getValidDataObjectKeys() {
		return [
			ATTRIBUTE_NAMES.META
		];
	}
}

/**
 * New Clown() data payload requirements:
 *
 *   {
 *     [ATTRIBUTE_NAMES.META]: {
 *       [ATTRIBUTE_NAMES.ID]: int
 *       [CLOWN_ATTR_NAME.TEXT]: string
 *     }
 *   }
 *
 **/
const CLOWN_ATTR_NAME = {
	TEXT: 'text',
};
class Clown extends Generic {
	getModelType() {
		return MODEL_TYPES.CLOWN;
	}

	represent() {
		return `${this.getModelType()} who says ${this.getCardinalValue()}`;
	}

	getCardinalValue() {
		return this.get('text');
	}

	getValidDataObjectKeys() {
		return [
			...super.getValidDataObjectKeys(),
			...Object.values(CLOWN_ATTR_NAME),
		];
	}
}

/**
 * New TextNode() data payload requirements:
 *
 *   {
 *     [ATTRIBUTE_NAMES.META]: {
 *       [ATTRIBUTE_NAMES.ID]: int
 *       [TEXT_NODE_ATTR_NAME.TEXT]: string
 *     }
 *   }
 *
 **/
const TEXT_NODE_ATTR_NAME = {
	TEXT: 'text',
};
class TextNode extends Generic {
	getModelType() {
		return MODEL_TYPES.TEXT_NODE;
	}

	represent() {
		const author = this.annuitCœptisII.getById(this.getAuthorId()) || User.getAnonymous();
		return `❝${this.getCardinalValue()}❞ - ${author.getCardinalValue()}`;
	}

	getCardinalValue() {
		return this.get('text');
	}

	getValidDataObjectKeys() {
		return [
			...super.getValidDataObjectKeys(),
			...Object.values(TEXT_NODE_ATTR_NAME),
		];
	}
}

/**
 * New User() data payload requirements:
 *
 *   {
 *     [ATTRIBUTE_NAMES.META]: {
 *       [ATTRIBUTE_NAMES.ID]: int
 *       [USER_ATTR_NAME.NAME]: string
 *     }
 *   }
 *
 **/
const USER_ATTR_NAME = {
	NAME: 'name',
};
class User extends Generic {
	getModelType() {
		return MODEL_TYPES.USER;
	}

	be() {
		return this.annuitCœptisII.setLocalStorage(
			LOCAL_STORAGE_NAMES.SETTINGS,
			{
				...this.annuitCœptisII.getLocalStorage(LOCAL_STORAGE_NAMES.SETTINGS),
				userId: this.getId()
			}
		)
	}

	isCurrent() {
		const { userId } = this.annuitCœptisII.getLocalStorage(LOCAL_STORAGE_NAMES.SETTINGS);
		return userId === this.getId();
	}

	getValidDataObjectKeys() {
		return [
			...super.getValidDataObjectKeys(),
			...Object.values(USER_ATTR_NAME),
		];
	}

	represent() {
		return `${this.getCardinalValue()} (${this.getModelType()} #${this.getId()})`;
	}

	getCardinalValue() {
		return this.get(USER_ATTR_NAME.NAME);
	}
};
User.__proto__.getAnonymous = () => new User(
	{
		name: '👤 Anonymous',
		_meta: {
			id: -1
		}
	}
);

export {
	MODEL_TYPES,
	EVENT_TYPES,
	ATTRIBUTE_NAMES,
	Generic,
	Clown,
	TextNode,
	User,
}