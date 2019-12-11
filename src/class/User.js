import DataManager from './DataManager';
import { NODE_TYPES } from './AbstractNode';
const anonymousUser = {
  data: {
    id: -1,
    name: '👤 Anonymous',
  }
};

class User extends DataManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_USER;
	}

	be(userId) {
		return this.annuitCœptis.setCurrentUser(userId);
	}

	getCurrent() {
		return this.annuitCœptis.getCurrentUser() || anonymousUser;
	}

	_createNodeData(nodeData) {
		if (typeof nodeData !== 'string') return false;

		return super._createNodeData({
			name: nodeData,
		});
	}
};

export {
	anonymousUser,
	User as default,
};