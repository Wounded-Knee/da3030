import React from 'react';
import ReactDOM from 'react-dom';
import * as Models from './class/Models';
import AnnuitCœptisII from './class/AnnuitCœptisII';
const {
	MODEL_TYPES,
	ATTRIBUTE_NAMES,
	EVENT_TYPES,
	TextNode,
	Certificate,
} = Models;
const annuitCœptisII = new AnnuitCœptisII();
const fakeDates = [
	'2019-12-16T07:29:26.032Z',
	'2019-13-16T07:29:26.032Z',
	'2019-14-16T07:29:26.032Z',
	'2019-15-16T07:29:26.032Z',
	'2019-16-16T07:29:26.032Z',
	'2019-17-16T07:29:26.032Z',
	'2019-18-16T07:29:26.032Z',
];
const genericData = () => ({
	_meta: {
		id: 0,
	}
});
const textNodeData = () => ({
	...genericData(),
	text: 'Dinosaurs Went Extinct',
});
const certificateData = () => ({
	...genericData(),
	emoji: '🦖',
	name: 'Extinction',
	title: 'How do you think it feels to be extinct?',
	subtitle: 'Dinosaurs',
	redux: 'Brachyosaurus',
});
const mockDates = events => events.map(event => ({ ...event, date: fakeDates.pop() }));

it(`Accumulates events`, () => {
	const textNode = new TextNode(textNodeData());
	const cert = new Certificate(certificateData());

	expect(mockDates(textNode.getEvents())).toMatchSnapshot();
	textNode.certifyWith(cert);
	expect(mockDates(textNode.getEvents())).toMatchSnapshot();
});

it(`Returns most recent event`, () => {
	const textNode = new TextNode(textNodeData());
	const cert = new Certificate(certificateData());
	const selector = event => {
		return event.type === EVENT_TYPES.CERTIFIED || event.type === EVENT_TYPES.DECERTIFIED
	}

	textNode.certifyWith(cert);
	const mostRecent1 = mockDates(textNode.getEventsBySelector(
		selector,
		'mostRecent',
	));
	const leastRecent1 = mockDates(textNode.getEventsBySelector(
		selector,
		'leastRecent',
	));
	expect(mostRecent1).toMatchSnapshot();
	expect(leastRecent1).toMatchSnapshot();

	textNode.decertifyWith(cert);
	const mostRecent2 = mockDates(textNode.getEventsBySelector(
		selector,
		'mostRecent',
	));
	const leastRecent2 = mockDates(textNode.getEventsBySelector(
		selector,
		'leastRecent',
	));
	expect(mostRecent2).toMatchSnapshot();
	expect(leastRecent2).toMatchSnapshot();
});

