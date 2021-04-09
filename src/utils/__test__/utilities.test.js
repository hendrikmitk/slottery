const { drawItems } = require('../utilities');

const names = ['Kalle', 'Per', 'Albin', 'Magnus', 'Viggo', 'Olaf', 'Knut', 'Gunnar', 'Eric', 'Stig', 'Tore', 'Ivar'];

describe('drawItems utility function', () => {
	test('select correct amount of items', () => {
		const result = drawItems(names, 5);
		expect(result).toHaveLength(5);
	});
});
