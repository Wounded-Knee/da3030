import {
	LOCAL_STORAGE_NAMES,
	MODEL_TYPES,
	EVENT_TYPES,
	ATTRIBUTE_NAMES
} from '../PROPHET60091';
var moment = require('moment');

/**
 * Generic Model
 * 
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
 *
 * @class      Generic (name)
 */
class Generic {
	/**
	 * Constructs a new instance.
	 *
	 * @param      {object}  data            The data
	 * @param      {object}  annuitCœptisII  annuitCœptisII
	 */
	constructor(data, annuitCœptisII) {
		this.annuitCœptisII = annuitCœptisII;
		this.set(data);
		this.dirty = false;
	}

	/**
	 * Handles changes. Override in subclasses. Executes when any piece of data in this model is changed.
	 * Signals annuitCœptisII.
	 * @virtual
	 */
	onChange() {
		if (this.annuitCœptisII) this.annuitCœptisII.somethingChanged(this);
	}

	/**
	 * Gets the model type.
	 *
	 * @return     {string}  The model type.
	 */
	getModelType() {
		return MODEL_TYPES.GENERIC;
	}

	/**
	 * Gets anything or everything
	 *
	 * @type       {boolean}
	 * @param      {string} attribute 			Name of the data attribute to return
	 * @return     {*}							Data from this model
	 */
	get(attribute) {
		return attribute ? this.data[attribute] : this.data;
	}

	/**
	 * Called on creation of an instance of this model with new data.
	 * Not called when old data is rehydrated within a new instance of this model.
	 *
	 * @virtual
	 * @return     {boolean}  Success
	 */
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
							...(metaData.events || []).map(event => ({
									...event,
									date: moment(event.date), // Rehydrate date objects
								})
							),
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

	addChild(childNode) {
		childNode.setParent(this);
		this.recordEvent(EVENT_TYPES.ADOPTED, childNode.getId());
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
			node =>
				getParentId(node) === this.getId() &&
				!node.isDeleted()
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

	isDeleted() {
		return this.getEventsByType(EVENT_TYPES.DELETED).length > 0;
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
			: User.getAnonymous().getId();
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
		this.onRecordEvent(newEvent);
		if (this.isEventDirty(eventType)) {
			this.dirty = true;
			this.onChange();
		}
		return newEvent;
	}

	onRecordEvent(newEvent) {
		return false;
	}

	// Returns true if this type of event
	// has the effect of dirtying the model state
	isEventDirty(eventType) {
		return [
			EVENT_TYPES.CREATED,
			EVENT_TYPES.CERTIFIED,
			EVENT_TYPES.SET_DATA_OBJ,
			EVENT_TYPES.SET_DATA,
			EVENT_TYPES.DELETED,
			EVENT_TYPES.ADOPTED,
			EVENT_TYPES.ADOPTEDBY,
			EVENT_TYPES.ORPHANED,
			/*
			 * Can't add this now, because it causes a
			 * state update, which causes a re-render,
			 * which causes another TRACK event, and
			 * infinite recursion.
			EVENT_TYPES.TRACK,
			 */
		].indexOf(eventType) !== -1;
	}

	getEvents() {
		return this.metaData.events;
	}

	/**
	 * eventType Array / String event type(s) to include
	 **/
	getEventsByType(eventType) {
		const eventTypes = !(eventType instanceof Array)
			? [eventType]
			: eventType;

		return this.getEvents().filter(
			event => eventTypes.includes(event.type)
		);
	}

	getEventsBySelector(selector, reducer = undefined) {
		const reducers = {
			mostRecent: (accumulator, currentValue) => {
				return !accumulator.data ? currentValue : (() => {
					const date1 = moment(accumulator.date);
					const date2 = moment(currentValue.date);
					const isBefore = date1.isBefore(date2);
					console.log(
						date1.format('MMMM Do YYYY, h:mm:ss a'),
						isBefore ? '<' : '>',
						date1.format('MMMM Do YYYY, h:mm:ss a'),
					);
					return isBefore
						? currentValue
						: accumulator
				})()
			},
			leastRecent: (accumulator, currentValue) => {
				return !accumulator.data ? currentValue : (() => {
					const date1 = moment(accumulator.date);
					const date2 = moment(currentValue.date);
					const isBefore = date1.isBefore(date2);
					console.log(
						date1.format('MMMM Do YYYY, h:mm:ss a'),
						isBefore ? '<' : '>',
						date1.format('MMMM Do YYYY, h:mm:ss a'),
					);
					return !isBefore
						? currentValue
						: accumulator
				})()
			}
		};
		var eventSelection = this.getEvents().filter(
			event => selector(event)
		);
		if (reducer) {
			console.log('Reducing '+eventSelection.length+' events', eventSelection);
			eventSelection = eventSelection.reduce(reducers[reducer], []);
		}
		return eventSelection;
	}

	/**
	 * Validator
	 * Returns true if the given object meets
	 * this model's requirements.
	 **/
	isValidDataObject(data) {
		const methodSignature = `${this.getModelType()}.isValidDataObject()`;
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
					console.warn(
						`${methodSignature} received invalid keys: `, unknownKeys, data
					);
				}
				if (requiredKeysWhichWereProvided.length !== requiredKeys.length) {
					console.warn(`${methodSignature} got: `, requiredKeysWhichWereProvided, 'Need: ', requiredKeys);
				}
				return false;
			};
		} else {
			console.warn(
				`${methodSignature} was called with shit data, boss.`
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
};
Generic.__proto__.getAll = function(annuitCœptisII) {
	return annuitCœptisII.getByModelType(
		Generic.prototype.getModelType()
	);
};

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

/**
 * @classdesc A nonsense class which is never used.
 * It's useless and accomplishes nothing.
 * It has been used for occasional testing.
 * Your continued reading of this comment
 * is a waste of your time.
 *
 * @class      Clown (name)
 */
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
 * New Cloud() data payload requirements:
 *
 *   {
 *     [ATTRIBUTE_NAMES.META]: {
 *       [ATTRIBUTE_NAMES.ID]: int
 *       [CLOUD_ATTR_NAME.TEXT]: string
 *     }
 *   }
 *
 **/
const CLOUD_ATTR_NAME = {
	TRACKED_NODE_ID: 'trackedNodeId',
	DEFAULT: 'default',
	TO_OTHERS_ABOUT_MEMBER: 'to_others_about_member',
	TO_MEMBER_ABOUT_MEMBER: 'to_member_about_member',
	TO_MEMBER_ABOUT_OTHERS: 'to_member_about_others',
};
const CLOUD_EXAMPLE_ATTRS = {
	default: {
		name: 'Example Cloud',
	},
	to_others_about_member: {
		description: '',
	},
	to_member_about_member: {

	},
	to_member_about_others: {
		name: 'name',
	},
};
/**
 * This class describes a cloud.
 *
 * @class      Cloud (name)
 */
class Cloud extends Generic {
	getModelType() {
		return MODEL_TYPES.CLOUD;
	}

	get(attribute) {
		return attribute
			? (
				this.data[CLOUD_ATTR_NAME.TO_MEMBER_ABOUT_MEMBER][attribute] ||
				this.data[CLOUD_ATTR_NAME.DEFAULT][attribute] ||
				''
			) : this.data;
	}

	/**
	 * Determines if the given user is eligible to join this Cloud.
	 *
	 * @param      {@link User}   		user    The user
	 * @param      {@link Generic}   	node    The node
	 * @return     {boolean}  True if user eligible, False otherwise.
	 */
	isUserEligible(user, node) {
		return (
			node.getId() === this.get(CLOUD_ATTR_NAME.TRACKED_NODE_ID) &&
			!!user.getTracksByNode(node).length > 0
		);
	}

	isUserEnrolled(user) {
		return false;
	}

	represent() {
		return `${this.getModelType()} who says ${this.getCardinalValue()}`;
	}

	getValidDataObjectKeys() {
		return [
			...super.getValidDataObjectKeys(),
			...Object.values(CLOUD_ATTR_NAME),
		];
	}
}

/**
 **/
class Collection extends Generic {
	getModelType() {
		return MODEL_TYPES.COLLECTION;
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

	// Returns all certificates
	// Each certificate has flags regarding its relationship with this node.
	// 		bool	isRatified	Does the crowd consensus bless this certificate?
	//		int 	score 		How ratified is it?
	//		array 	users 		Who ratified it?
	getCertifications() {
		return this.getEventsByType([EVENT_TYPES.CERTIFIED, EVENT_TYPES.DECERTIFIED]).map(
			event => {
				return {
					...event,
					certificate: this.annuitCœptisII.getById(event.data.certificateId),
				};
			}
		);
	}

	// Returns all active certificates
	getActiveCertificates() {
		const scoreMinimum = 1;
		const certificates = this.getCertificates();
		const scores = certificates.reduce(
			(scores, event) => {
				const cert = event.certificate;
				return {
					...scores,
					[cert.getId()]: (scores[cert.getId()] || 0) + 1,
				}
			}, {}
		);
		for (let key in scores) {
			if(scores.hasOwnProperty(key) && scores[key] > scoreMinimum) {
				const certId = key
				const score = scores[certId];
				activeCertificates.push(
					scores
				)
			}
   		}
		const activeCertificates = [];
		/*
		scores.reduce(
			(activeCertificates, score) => {
				if (score)
			}, []
		)
		*/
		console.log(`getActiveCertificates() ${this.represent()} `, scores);
		return scores;
	}

	hasCertificate(certificate) {
		return !!this.getCertificates().filter(
			event => {
				return event.data.certificateId === certificate.getId();
			}
		).length;
	}

	certifyWith(certificate) {
		this.recordEvent(EVENT_TYPES.CERTIFIED, { certificateId: certificate.getId() });
	}

	decertifyWith(certificate) {
		this.recordEvent(EVENT_TYPES.DECERTIFIED, { certificateId: certificate.getId() });		
	}

	getValidDataObjectKeys() {
		return [
			...super.getValidDataObjectKeys(),
			...Object.values(TEXT_NODE_ATTR_NAME),
		];
	}
}

/**
 * New Certificate() data payload requirements:
 * ```json
 *   {
 *     [ATTRIBUTE_NAMES.META]: {
 *       [ATTRIBUTE_NAMES.ID]: int
 *       [CERTIFICATE_ATTR_NAME.EMOJI]: string
 *       [CERTIFICATE_ATTR_NAME.NAME]: string
 *       [CERTIFICATE_ATTR_NAME.TITLE]: string
 *       [CERTIFICATE_ATTR_NAME.SUBTITLE]: string
 *       [CERTIFICATE_ATTR_NAME.REDUX]: string
 *     }
 *   }
 * ```
 *
 **/
const CERTIFICATE_ATTR_NAME = {
	EMOJI: 'emoji',
	NAME: 'name',
	TITLE: 'title',
	SUBTITLE: 'subtitle',
	REDUX: 'redux',
};
class Certificate extends Generic {
	getModelType() {
		return MODEL_TYPES.CERTIFICATE;
	}

	getModels() {
		return this.annuitCœptisII.getByModelType(MODEL_TYPES.TEXT_NODE).filter(
			textNode =>
				textNode
					.getEventsByType(EVENT_TYPES.CERTIFIED)
					.filter(
						event => event.certificateId === this.getId()
					)
					.length > 0
		);
	}

	represent() {
		const name = this.get(CERTIFICATE_ATTR_NAME.NAME);
		const emoji = this.get(CERTIFICATE_ATTR_NAME.EMOJI);
		const cardinalValue = this.getCardinalValue();
		return `🛡${emoji} ${name} (#${cardinalValue})`;
	}

	getValidDataObjectKeys() {
		return [
			...super.getValidDataObjectKeys(),
			...Object.values(CERTIFICATE_ATTR_NAME),
		];
	}
}
Certificate.__proto__.getModelsCertified = () => {
	console.log(this.annuitCœptisII);
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

	// Returns tracks this user has on the given node
	getTracksByNode(node) {
		return node.getEventsByType(EVENT_TYPES.TRACK).filter(
			event => event.get('userId') === this.getId()
		);
	}

	// Returns all nodes which have the given certificates from this user.
	getNodesByCertificate(certificates) {
		this.annuitCœptisII
			.getByModelType(MODEL_TYPES.TEXT_NODE)
			.filter(model => {
				
			})
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

	getModels(filter = node => true) {
		return this.annuitCœptisII.filter(
			node => filter(node) && node.getMetaData('authorId') === this.getId()
		);
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
	Cloud,
	Certificate,
	TextNode,
	User,
}