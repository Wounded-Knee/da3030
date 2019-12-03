import NodeManager from './NodeManager';
import { NODE_TYPES } from './Node';

class User extends NodeManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_USER;
	}

	be(userId) {
		return this.annuitCœptis.setCurrentUser(userId);
	}

	getCurrent() {
		return this.annuitCœptis.getCurrentUser();
	}

	_createNodeData(nodeData) {
		return {
			data: nodeData,
			name: nodeData,
			username: nodeData,
		}
	}
};

export default User;