import Policy from './Policy';
import Certification from './Certification';
import User from './User';
import Node from './NodeClass';
const tax = require('taxonomy').tax;
const localStorageName = 'AnnuitCœptis';
const localStorageSettingsName = 'da3000';
const taxMethodsToAlias = [
	'addNode',
	'createNode',
	'insert',
	'path',
	'update',
	'find',
	'getTree',
	'setTree',
];
const taxMethodsCausingChanges = [
	'update',
	'addNode',
	'insert'
];
var settings = {
	userId: undefined,
	bossMode: false,
};

class AnnuitCœptis {
	constructor(config) {
		this.config = config;

		// Method aliases
		taxMethodsToAlias.forEach(
			methodName => this[methodName] = function() {
				const rv = tax[methodName].apply(tax, arguments);
				if (taxMethodsCausingChanges.indexOf(methodName) !== -1) {
					this.signalChange();
				}
				return rv;
			}
		);

		const args = {
			annuitCœptis: this,
		};
		this.tax = tax;
		this.Policy = new Policy(args);
		this.Certification = new Certification(args);
		this.User = new User(args);
		this.Node = new Node(args);
		this.load();
	}

	// Extension of tax() method
	remove(node) {
		var rv = this.tax.remove(node._id);
		this.signalChange();
		return rv;
	}

	signalChange() {
		this.persist();
		this.config.onChange();
	}

	persist() {
		localStorage.setItem(localStorageName, JSON.stringify(this.getTree()));
		localStorage.setItem(localStorageSettingsName, JSON.stringify(settings));
	}

	load() {
		const { storageData } = this.getLocalStorageInfo();
		const storageSettings = localStorage.getItem(localStorageSettingsName);

		if (storageData) this.setTree(JSON.parse(storageData));
		if (storageSettings) settings = JSON.parse(storageSettings);

		document.getElementsByTagName('html')[0].className = settings.bossMode ? 'bossMode' : '';
	}

	getSettings() {
		return settings;
	}

	getLocalStorageInfo() {
		const storageData = localStorage.getItem(localStorageName);
		return {
			storageData: storageData,
		}
	}

	getCurrentUser() {
		return this.User.getById( settings.userId );
	}

	setCurrentUser(userId) {
		settings.userId = userId;
		this.signalChange();
	}

	toggleBossMode() {
		settings.bossMode = !settings.bossMode;
		this.signalChange();
		document.getElementsByTagName('html')[0].className = settings.bossMode ? 'bossMode' : '';
	}
};

export default AnnuitCœptis;