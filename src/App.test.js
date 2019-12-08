import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const addUser = username => {
	return da.annuitCœptis.User.create(username);
}

const getUser = username => {
	return da.annuitCœptis.User.filter(
		user => user.data.name === username
	)[0];
}

const addNode = (words, parentNode = null) => {
	return da.annuitCœptis.Node.create(words, parentNode);
}

const getNodeById = id => {
	return da.annuitCœptis.Node.getById(id);
}

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});

it('can add user', () => {
	addUser('John Locke');
	const gotUser = getUser('John Locke');
	expect(gotUser.data).toMatchSnapshot();
})

it('can be user', () => {
	da.annuitCœptis.User.be(0);
	const gotUser = da.annuitCœptis.getCurrentUser();
	expect(gotUser.data).toMatchSnapshot();
})

it('can add second user', () => {
	addUser('Benjamin Franklin');
	expect(getUser('Benjamin Franklin').data).toMatchSnapshot();
})

it('persists users between tests', () => {
	expect(getUser('Benjamin Franklin').data).toMatchSnapshot();	
});

it('can add a node', () => {
	const newNode = addNode('Test');
	expect(getNodeById(newNode.data.id).data).toMatchSnapshot();
})

it('can add a child node', () => {
	const parentNode = addNode('Test 2');
	expect(getNodeById(parentNode.data.id).children).toMatchSnapshot();

	const childNode = addNode('Test 2.1', parentNode);
	expect(getNodeById(parentNode.data.id).children[0].data).toMatchSnapshot();
});

