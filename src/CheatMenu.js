import React from 'react';

const menu = {
	'Initialize': {
		summary: 'Wipe all data clean and insert fresh testing data.',
		execute: (cheatMenu) => {
			const { da, redirect } = cheatMenu.props;
			const { initialize } = da;
			if (window.confirm('Are you sure?')) {
				initialize();
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
		const { initialize } = this.props.da;
		return (
			<>
				<button id="money" onClick={ this.onClick.bind(this) }>💵</button>
				<div id="moneyMenu" className={ this.state.menuOpen ? 'open' : null }>
					<ul>
						{ Object.keys(menu).map( key => {
							const item = menu[key];
							return (
								<li onClick={ this.onItemClick.bind(this, key) } title={ item.summary }>
									{ key }
								</li>
							);
						})}
					</ul>
					<div class="logo">
						<span class="d">D</span>
						<span class="three">3</span>
					</div>
				</div>
			</>
		);
	}
}

export default CheatMenu;
