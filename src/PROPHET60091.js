const LOCAL_STORAGE_NAMES = {
	SETTINGS: 'Settings',
	DATA: 'Data',
};
const MODEL_TYPES = {
	GENERIC: 'Generic',
	CLOWN: 'Clown',
	USER: 'User',
	CLOUD: 'Cloud',
	COLLECTION: 'Collection',
	TEXT_NODE: 'TextNode',
	CERTIFICATE: 'Certificate',
	CLOUD_NOTIFICATION: 'CloudNotification',
	HOME_NOTIFICATION: 'HomeNotification',
	USER_NOTIFICATION: 'UserNotification',
};
const EVENT_TYPES = {
	CREATED: 'Created',
	CERTIFIED: 'Certified',
	DECERTIFIED: 'Decertified',
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

export {
	LOCAL_STORAGE_NAMES,
	MODEL_TYPES,
	EVENT_TYPES,
	ATTRIBUTE_NAMES,
};
