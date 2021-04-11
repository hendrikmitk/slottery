const { drawItems } = require('../utilities');

const names = ['Kalle', 'Per', 'Albin', 'Magnus', 'Viggo', 'Olaf', 'Knut', 'Gunnar', 'Eric', 'Stig', 'Tore', 'Ivar'];

describe('drawItems function', () => {
	test('return requested amount of items', () => {
		const result = drawItems(names, 5);
		expect(result).toHaveLength(5);
	});
	test('not return more items than available', () => {
		const result = drawItems(names, 31);
		expect(result).toBeFalsy();
	});
	describe('arr argument', () => {
		test('accept only typeof array', () => {
			const result = drawItems('names', 7);
			expect(result).toBeFalsy();
		});
		test('return when argument is missing', () => {
			const result = drawItems(9);
			expect(result).toBeFalsy();
		});
	});
	describe('qty argument', () => {
		test('accept no strings', () => {
			const result = drawItems(names, 'foo');
			expect(result).toBeFalsy();
		});
		test('round float < x.5 to nearest integer', () => {
			const result = drawItems(names, 4.21);
			expect(result).toHaveLength(4);
		});
		test('round float > x.5 to nearest integer', () => {
			const result = drawItems(names, 4.74);
			expect(result).toHaveLength(5);
		});
		test('return input when argument missing', () => {
			const result = drawItems(names);
			expect(result).toEqual(names);
		});
	});
});
