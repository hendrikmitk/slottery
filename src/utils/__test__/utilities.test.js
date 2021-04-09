const { drawItems } = require('../utilities');

const names = ['Kalle', 'Per', 'Albin', 'Magnus', 'Viggo', 'Olaf'];

describe('drawItems utility function', () => {
	test('select correct amount of items', () => {
		drawItems(names, 3).then(result => {
			expect(result).toHaveLength(3);
			console.log(result);
		});
	});
});
