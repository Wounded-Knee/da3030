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
const getData = (modelType, iterator) => {
	var data = {
		_meta: {
			id: iterator
		}
	};
	switch (modelType) {
		case MODEL_TYPES.TEXT_NODE:
			return {
				...data,
				text: `This is ${modelType} #${iterator}`
			};
		break;
		case MODEL_TYPES.CLOWN:
			return {
				...data,
				text: `🤡 ${iterator}`
			};
		break;
		default:
			return data;
		break;
	}
};

const testCreateBatchByType = (modelType, qty, getDataCallback = getData) => {
	for (var x=0; x<qty; x++) {
		annuitCœptisII.create(getDataCallback(modelType, x), modelType);
	}

	expect(
		annuitCœptisII.filter(
			node => node.getModelType() === modelType
		).length
	).toEqual(qty);
};

it(`Is not dirty`, () => {
	expect(annuitCœptisII.isDirty()).toEqual(false);
});

it(`Can create 5c GENERIC nodes`, () => {
	testCreateBatchByType(
		MODEL_TYPES.GENERIC,
		500,
	);
});

it(`Can create 5c CLOWN nodes`, () => {
	testCreateBatchByType(
		MODEL_TYPES.CLOWN,
		500,
	);
});

it(`Is dirty due to creating nodes`, () => {
	expect(annuitCœptisII.isDirty()).toEqual(true);
});

it(`Cannot be clear()'ed`, () => {
	expect(annuitCœptisII.clear()).toEqual(false);
	expect(annuitCœptisII.getData().length).toMatchSnapshot();
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
	expect(annuitCœptisII.getData().length).toMatchSnapshot();	
});

it(`Can retrieve an arbitrary node by text value`, () => {
	annuitCœptisII.clear(true);
	expect(annuitCœptisII.getData().length).toEqual(0);
	expect(annuitCœptisII.iterator).toMatchSnapshot();

	testCreateBatchByType(
		MODEL_TYPES.TEXT_NODE,
		3,
		(modelType, iterator) => ({
			...getData(modelType, iterator),
			text: testTextValue,
		}),
	);

	const results = annuitCœptisII.filter(
		node => node.get('text') === testTextValue
	);
	expect(results.length).toEqual(3);
	expect(results[2].getId()).toMatchSnapshot();
});

it(`Can have children`, () => {
	const eventType = EVENT_TYPES.ADOPTEDBY;
	annuitCœptisII.clear(true);

	testCreateBatchByType(
		MODEL_TYPES.GENERIC,
		1914,
	);

	const [
		parent,
		child
	] = annuitCœptisII.getByModelType(MODEL_TYPES.GENERIC);
	expect(parent.represent()).toMatchSnapshot();
	expect(child.represent()).toMatchSnapshot();
	expect(child.getEventsByType(eventType).length).toEqual(0);
	child.setParent(parent);
	expect(child.getEventsByType(eventType).length).toEqual(1);
	expect(parent.getChildren()[0].getId()).toEqual(child.getId());
	expect(child.getParent().getId()).toEqual(parent.getId());
});

it(`Can be orphaned`, () => {
	const [
		,child
	] = annuitCœptisII.getByModelType(MODEL_TYPES.GENERIC);
	expect(child.getParent()).not.toBeFalsy();
	child.orphan();
	expect(child.getParent()).toBeFalsy();
});

it(`Can set data by attribute`, () => {
	const testTextValue2 = 'H.Con.Res.331-1988';
	testCreateBatchByType(
		MODEL_TYPES.TEXT_NODE,
		3,
		(modelType, iterator) => ({
			...getData(modelType, iterator),
			text: testTextValue2,
		}),
	);

	const [ node ] = annuitCœptisII.getByModelType(MODEL_TYPES.TEXT_NODE);
	expect(node.get('text')).toMatchSnapshot();
	node.set(testTextValue, 'text');
	expect(node.get('text')).toMatchSnapshot();
});

it(`Records audit trail in events`, () => {
	const [ node ] = annuitCœptisII.getByModelType(MODEL_TYPES.TEXT_NODE);
	node.set(testTextValue, 'text');
	const events = node.getEventsByType(EVENT_TYPES.SET_DATA);
	expect(events[0].type).toMatchSnapshot();
	expect(events.length).toMatchSnapshot();
});
