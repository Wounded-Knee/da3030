import DataManager from './DataManager';
import { NODE_TYPES } from './Node';

class Policy extends DataManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_POLICY;
	}
};

export default Policy;