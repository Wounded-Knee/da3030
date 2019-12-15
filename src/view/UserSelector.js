import React from 'react';
import { MODEL_TYPES, User } from '../class/Models';

const UserSelector = ({ annuitCœptisII }) => {
	const users = annuitCœptisII.getByModelType(MODEL_TYPES.USER);
	const currentUser = annuitCœptisII.getCurrentUser();
	const onChange = e => {
		const index = e.nativeEvent.target.selectedIndex;
		const selectedUser = users[index];
		console.log('Being ', selectedUser.represent());
		selectedUser.be();
		annuitCœptisII.somethingChanged();
	};

	return (
		<select className="userSelector" value={ currentUser.get('name') } onChange={ onChange }>
			{ users.map( (user, index) => {
				const [ emoji ] = user.get('name');
				return (
					<option key={ index } value={ user.get('name') }>{ emoji }</option>
				);
			}) }
		</select>
	);
}

export default UserSelector;
