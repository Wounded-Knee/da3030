import React from 'react';

class CheatMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,

		};
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
				<ul id="moneyMenu" className={ this.state.menuOpen ? 'open' : null }>
					<li onClick={ () => {
						if (window.confirm('Are you sure?')) {
							initialize()
						}
					}}>Initialize</li>
				</ul>
			</>
		);
	}
}

export default CheatMenu;
