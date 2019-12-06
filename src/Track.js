import NodeManager from './NodeManager';
import { NODE_TYPES } from './Node';

class Track extends NodeManager {
	constructor() {
		super(...arguments);
		this.nodeType = NODE_TYPES.NODE_TYPE_TRACK;
		this.currentUser = this.annuitCœptis.getCurrentUser();
	}

	getByNode(node) {
		const currentUser = this.annuitCœptis.getCurrentUser();
		if (!currentUser) return [];

		return this.filter(
			track => track.userId === currentUser.id && track.nodeId === node.id
		);
	}

	userAddTrack(node, user) {
		const oldSettings = this.annuitCœptis.getSettings();

		return this.annuitCœptis.setSettings({
			...oldSettings,
			tracks: [
				...(oldSettings.tracks || []),
				{
					nodeId: node.id,
					userId: user.id,
					date: new Date(),
				},
			],
		});
	}

	userHasTrack(nodeId, user) {
		return this.getUserTracks(user).filter(
			track => track.nodeId === nodeId && track.userId === user.id
		).length > 0;
	}

	getUserTracks(user) {
		const settings = this.annuitCœptis.getSettings();

		return settings.tracks;
	}

	_createNodeData(nodeData) {
		const currentUser = this.annuitCœptis.getCurrentUser();
		if (!currentUser) return false;

		console.log('Creating Track', nodeData);

		return {
			data: 'Node #'+nodeData.id,
			userId: currentUser.id,
			nodeId: nodeData.id,
			date: new Date(),
		}
	}

	_create(parentNode = null, data, otherData) {
		return true;
		// const newId = this._getFreshId();
		// const oldSettings = this.annuitCœptis.getSettings();
		// const newSettings = { ...oldSettings };

		// this.annuitCœptis.setSettings(newSettings);
	}
};

export default Track;