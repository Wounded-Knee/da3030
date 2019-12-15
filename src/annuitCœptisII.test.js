import React from 'react';
import ReactDOM from 'react-dom';
import * as Models from './class/Models';
import AnnuitCœptisII from './class/AnnuitCœptisII';
const {
	MODEL_TYPES,
	ATTRIBUTE_NAMES,
	EVENT_TYPES,
} = Models;
const annuitCœptisII = new AnnuitCœptisII();
const saveFileName = 'SH10151';
const testTextValue = '1GCEG15W4Y1142815';
const getData = (nodeType, iterator) => ({ text: `This is ${nodeType} #${iterator}` });

const testCreateBatchByType = (nodeType, qty, getDataCallback = getData) => {
	for (var x=0; x<qty; x++) {
		annuitCœptisII.create(getDataCallback(nodeType, x), nodeType);
	}

	expect(
		annuitCœptisII.filter(
			node => node.getModelType() === nodeType
		).length
	).toEqual(qty);
};

it(`Is not dirty`, () => {
	expect(annuitCœptisII.isDirty()).toEqual(false);
});

it(`Can create 5k GENERIC nodes`, () => {
	testCreateBatchByType(
		MODEL_TYPES.GENERIC,
		5000,
	);
});

it(`Can create 5k CLOWN nodes`, () => {
	testCreateBatchByType(
		MODEL_TYPES.CLOWN,
		5000,
	);
});

it(`Is dirty due to creating nodes`, () => {
	expect(annuitCœptisII.isDirty()).toEqual(true);
});

it(`Cannot be clear()'ed`, () => {
	expect(annuitCœptisII.clear()).toEqual(false);
	expect(annuitCœptisII.getData().length).toEqual(10000);
});

it(`Can save()`, () => {
	annuitCœptisII.save(saveFileName);
});

it(`Is not dirty`, () => {
	expect(annuitCœptisII.dirty).toEqual(false);
});

it(`Can be clear()'ed`, () => {
	expect(annuitCœptisII.clear()).toEqual(true);
	expect(annuitCœptisII.getData().length).toEqual(0);	
});

it(`Can load()`, () => {
	annuitCœptisII.load(saveFileName);
	expect(annuitCœptisII.getData().length).toEqual(10000);	
});

it(`Can retrieve an arbitrary node by text value`, () => {
	annuitCœptisII.clear(true);

	testCreateBatchByType(
		MODEL_TYPES.GENERIC,
		3,
		(nodeType, iterator) => ({ text: testTextValue }),
	);

	const results = annuitCœptisII.filter(
		node => node.get('text') === testTextValue
	);
	expect(results.length).toEqual(3);
	expect(results[2].getId()).toEqual(3);
});

it(`Can have children`, () => {
	const eventType = EVENT_TYPES.ADOPTEDBY;
	annuitCœptisII.clear(true);

	testCreateBatchByType(
		MODEL_TYPES.GENERIC,
		1914,
		(nodeType, iterator) => ({
			...getData(nodeType, iterator),
			maternityTest: true
		}),
	);

	const parent = annuitCœptisII.getById(10);
	const child = annuitCœptisII.getById(100);
	expect(child.getEventsByType(eventType).length).toEqual(0);
	child.setParent(parent);
	expect(child.getEventsByType(eventType).length).toEqual(1);
	expect(parent.getChildren()[0].getId()).toEqual(child.getId());
	expect(child.getParent().getId()).toEqual(parent.getId());
	expect(child.get('maternityTest')).toEqual(true);
});

it(`Can be orphaned`, () => {
	const child = annuitCœptisII.getById(100);
	expect(child.getParent()).not.toBeFalsy();
	child.orphan();
	expect(child.getParent()).toBeFalsy();
});

it(`Is clean after save()`, () => {
	// Previous testing dirtied it
	expect(annuitCœptisII.isDirty()).toEqual(true);
	annuitCœptisII.save();
	expect(annuitCœptisII.isDirty()).toEqual(false);
});

it(`Can set data by attribute`, () => {
	const node = annuitCœptisII.getById(1913);
	expect(node.get('text')).toEqual('This is Generic #1909');
	node.set(testTextValue, 'text');
	expect(node.get('text')).toEqual(testTextValue);
});

it(`Can get dirty by setting data in a child model`, () => {
	expect(annuitCœptisII.isDirty()).toEqual(true);	
});

it(`Records audit trail in events`, () => {
	const eventType = EVENT_TYPES.SET_DATA;
	const node = annuitCœptisII.getById(1913);
	const events = node.getEventsByType(eventType);
	expect(events[0].type).toEqual(eventType);
	expect(events.length).toEqual(1);
});

it(`Can be forced to clear() while dirty`, () => {
	expect(annuitCœptisII.isDirty()).toEqual(true);
	expect(annuitCœptisII.clear(true)).toEqual(true);
});
