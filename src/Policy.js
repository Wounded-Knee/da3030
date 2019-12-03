import NodeManager from './NodeManager';
import { NODE_TYPES } from './Node';

class Policy extends NodeManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_POLICY;
	}
};

export default Policy;