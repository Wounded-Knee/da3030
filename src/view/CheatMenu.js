import React from 'react';

const boomSummary = 'Wipe all data clean and insert fresh testing data.';
const menu = {
	'😎': {
		summary: 'Enable stealth mode, concealing D3 from shoulder surfers.',
		execute: (cheatMenu) => {
			const { annuitCœptis } = cheatMenu.props;
			annuitCœptis.toggleBossMode();
			return true;
		}
	},
	'💥': {
		summary: boomSummary,
		execute: (cheatMenu) => {
			const { da } = cheatMenu.props;
			const { initialize } = da;
			if (window.confirm(`${boomSummary}\n\nAre you sure?`)) {
				console.log(initialize());
				return true;
			}
			return false;
		}
	}
};

class CheatMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,

		};
	}

	onItemClick(menuItemKey) {
		const item = menu[menuItemKey];
		if (item.execute(this)) {
			this.setState({
				menuOpen: false
			});
		}
	}

	onClick() {
		console.log(this.state.menuOpen);
		this.setState({
			menuOpen: !this.state.menuOpen
		});
	}

	render() {
		const { annuitCœptis } = this.props;
		const localStorageSizeKb = parseInt(
			(annuitCœptis.getLocalStorageInfo().storageData || '').length / 1024 * 100
		)/100;

		return (
			<>
				<button id="money" onClick={ this.onClick.bind(this) }>💵</button>
				<div id="moneyMenu" className={ this.state.menuOpen ? 'open' : null }>
					<ul>
						{ Object.keys(menu).map( key => {
							const item = menu[key];
							return (
								<li key={ key } onClick={ this.onItemClick.bind(this, key) } title={ item.summary }>
									{ key }
								</li>
							);
						})}
					</ul>

					<dl>
						<dt title="Local Storage data size">💾</dt>
						<dd>{ localStorageSizeKb }Kb</dd>
					</dl>

					<div className="logo">
						<span className="d">D</span>
						<span className="three">3</span>
					</div>
				</div>
			</>
		);
	}
}

export default CheatMenu;
