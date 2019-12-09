import DataManager from './DataManager';
import { NODE_TYPES } from './AbstractNode';

class Certification extends DataManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_CERTIFICATION;
	}
};

export default Certification;