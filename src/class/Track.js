import DataManager from './DataManager';
import { NODE_TYPES } from './AbstractNode';

class Track extends DataManager {
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
		console.log(`${user.data.name} tracked: `, node.data.text.substring(0,50)+'...');

		return this.annuitCœptis.setSettings({
			...oldSettings,
			tracks: [
				...(oldSettings.tracks || []),
				{
					nodeId: node.data.id,
					userId: user.data.id,
					date: new Date(),
				},
			],
		});
	}

	userHasTrack(nodeId, user) {
		return this.getUserTracks(user).filter(
			track => track.nodeId === nodeId
		).length > 0;
	}

	getUserTracks(user) {
		return (this.annuitCœptis.getSettings().tracks || []).filter(
			track => track.userId === user.data.id
		);
	}

	_createNodeData(nodeData) {
		const currentUser = this.annuitCœptis.getCurrentUser();
		if (!currentUser) return false;

		return {
			data: 'Node #'+nodeData.id,
			userId: currentUser.data.id,
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