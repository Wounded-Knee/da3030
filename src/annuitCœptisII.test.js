import React from 'react';
import ReactDOM from 'react-dom';
import AnnuitCœptisII from './class/AnnuitCœptisII';
const annuitCœptisII = new AnnuitCœptisII();

it('Can create 5000 nodes', () => {
	for (var x=0; x<5000; x++) {
		annuitCœptisII.create({
			text: 'This is #'+x,
		});
	}
});

it('Can filter', () => {
	expect(annuitCœptisII.filter(node => node).length).toEqual(1000);
});

