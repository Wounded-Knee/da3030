import React from 'react';

const UserSelector = ({ annuitCœptis }) => {
	const users = annuitCœptis.User.getAll();
	const currentUser = annuitCœptis.User.getCurrent() || { id: -1, name: 'Anonymous' };
	const onChange = e => {
		const index = e.nativeEvent.target.selectedIndex;
		const userId = users[index].id;
		annuitCœptis.User.be(userId);
	};

	return (
		<select class="userSelector" onChange={ onChange }>
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
