import React from 'react';

const UserSelector = ({ annuitCœptis }) => {
	const users = annuitCœptis.User.getAll();
	const currentUser = annuitCœptis.User.getCurrent();
	const onChange = e => {
		const index = e.nativeEvent.target.selectedIndex;
		const userId = users[index].data.id;
		annuitCœptis.User.be(userId);
	};

	return (
		<select className="userSelector" onChange={ onChange }>
			{ users.map( (user, index) => {
				const [ emoji ] = user.data.name;
				return (
					<option key={ index } value={ user.data.id } selected={ user.data.id === currentUser.data.id }>{ emoji }</option>
				);
			}) }
		</select>
	);
}

export default UserSelector;
