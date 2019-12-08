import DataManager from './DataManager';
import { NODE_TYPES } from './Node';

class User extends DataManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_USER;
	}

	be(userId) {
		return this.annuitCœptis.setCurrentUser(userId);
	}

	getCurrent() {
		return this.annuitCœptis.getCurrentUser() || { data: { id: -1, name: '❓ Anonymous' } };
	}

	_createNodeData(nodeData) {
		if (typeof nodeData !== 'string') return false;

		return super._createNodeData({
			name: nodeData,
		});
	}
};

export default User;