import NodeManager from './NodeManager';
import { NODE_TYPES } from './Node';

class Certification extends NodeManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_CERTIFICATION;
	}
};

export default Certification;