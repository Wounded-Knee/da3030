import NodeManager from './NodeManager';
import { NODE_TYPES } from './Node';

class Cloud extends NodeManager {
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

	getByUserEligibility(user) {
		return this.filter(
			cloud => {
				const qualifiedClouds = cloud.external.qualification.filter(
					nodeId => this.annuitCœptis.Track.userHasTrack(nodeId, user)
				);
				return qualifiedClouds.length === cloud.external.qualification.length;
			}
		);
	}

	_createNodeData(nodeData) {
		const { userId } = this.annuitCœptis.getSettings();

		if (
			userId === undefined ||
			nodeData === undefined
		) return false;

		return {
			data: nodeData.internal.name,
			contributorId: userId,
			...nodeData,
		};
	}
};

export default Cloud;