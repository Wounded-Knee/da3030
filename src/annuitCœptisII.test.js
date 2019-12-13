import React from 'react';
import ReactDOM from 'react-dom';
import * as Models from './class/Models';
import AnnuitCœptisII from './class/AnnuitCœptisII';
const { MODEL_TYPES, ATTRIBUTE_NAMES } = Models;
const annuitCœptisII = new AnnuitCœptisII();
const saveFileName = 'SH10151';
const testTextValue = '1GCEG15W4Y1142815';

const testCreateBatchByType = (nodeType, qty) => {
	for (var x=0; x<qty; x++) {
		annuitCœptisII.create({
			text: `This is ${nodeType} #${x}`,
		}, nodeType);
	}

	expect(
		annuitCœptisII.filter(
			node => node.getModelType() === nodeType
		).length
	).toEqual(qty);
};

it(`Is not dirty`, () => {
	expect(annuitCœptisII.dirty).toEqual(false);
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

it(`Is dirty`, () => {
	expect(annuitCœptisII.dirty).toEqual(true);
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
	annuitCœptisII.create({
		text: testTextValue,
	}, MODEL_TYPES.GENERIC);

	const results = annuitCœptisII.filter(
		node => node.get('text') === testTextValue
	);
	expect(results.length).toEqual(1);
	expect(results[0].getId()).toEqual(1);
});

it(`Can be forced to clear() while dirty`, () => {
	expect(annuitCœptisII.dirty).toEqual(true);
	expect(annuitCœptisII.clear(true)).toEqual(true);
});
