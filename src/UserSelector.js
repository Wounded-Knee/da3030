import React from 'react';

const UserSelector = ({ annuitCœptis }) => {
	const users = annuitCœptis.getUsers();
	const currentUser = annuitCœptis.getCurrentUser() || { id: -1, name: 'Anonymous' };
	const onChange = e => {
		const index = e.nativeEvent.target.selectedIndex;
		const userId = users[index].id;
		annuitCœptis.setCurrentUser(userId);
	};

	return (
		<select onChange={ onChange }>
			{ users.map( (user, index) => {
				const [ emoji ] = user.name;
				return (
					<option key={ index } value={ user.id } selected={ user.id === currentUser.id }>{ emoji }</option>
				);
			}) }
		</select>
	);
}

export default UserSelector;
