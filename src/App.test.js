import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const getUserByName = username => {
	return da.annuitCœptis.User.filter(
		user => user.data.name === username
	)[0];
}

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});

it('can add user', () => {
	da.annuitCœptis.User.create('Benjamin Franklin');
	expect(getUserByName('Benjamin Franklin').data).toMatchSnapshot();
})

it('can add second user', () => {
	da.annuitCœptis.User.create('John Locke');
	expect(getUserByName('John Locke').data).toMatchSnapshot();
})

it('can be user', () => {
	da.annuitCœptis.User.be(1);
	expect(da.annuitCœptis.getCurrentUser().data).toMatchSnapshot();
})

it('can add a node', () => {
	const newNode = da.annuitCœptis.Node.create('As people are walking all the time, in the same spot, a path appears.');
	expect(da.annuitCœptis.Node.getById(newNode.data.id).data).toMatchSnapshot();
})

it('can add a child node', () => {
	const parentNode = da.annuitCœptis.Node.getById(0);
	const childNode = da.annuitCœptis.Node.create('We are like chameleons, we take our hue and the color of our moral character, from those who are around us.', parentNode);
	expect(da.annuitCœptis.Node.getById(parentNode.data.id).children[0].data).toMatchSnapshot();
});

it('can track a visit to a node', () => {
	const trackedNode = da.annuitCœptis.Node.getById(0);
	const untrackedNode = da.annuitCœptis.Node.getById(1);
	const user = da.annuitCœptis.getCurrentUser();
	const track = da.annuitCœptis.Track.userAddTrack(trackedNode, user);

	expect(da.annuitCœptis.Track.userHasTrack(trackedNode.data.id, user)).toEqual(true);
	expect(da.annuitCœptis.Track.userHasTrack(untrackedNode.data.id, user)).toEqual(false);
});
