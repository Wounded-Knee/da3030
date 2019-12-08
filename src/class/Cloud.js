import DataManager from './DataManager';
import { NODE_TYPES } from './Node';

class Cloud extends DataManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_CLOUD;
	}

	getByContributorId(contributorId) {
		return this.filter(
			cloud =>
				cloud.contributorId === contributorId
		);
	}

	// Returns info on how this user relates to this cloud.
	// Are they subscribed?
	getUserDisposition(user, cloud) {

	}

	getByUserEligibility(user) {
		return this.filter(
			cloud => {
				return cloud.external.qualification.filter(
					nodeId =>
						this.annuitCœptis.Track.userHasTrack(nodeId, user)
				).length === cloud.external.qualification.length
			}
		);
	}

	getNotifications(user) {
		return this.getByUserEligibility(user).length;
	}

	_createNodeData(nodeData) {
		const { userId } = this.annuitCœptis.getSettings();

		if (
			userId === undefined ||
			nodeData === undefined
		) return false;

		return {
			data: {
				...nodeData,
				contributorId: userId,
			}
		};
	}
};

export default Cloud;