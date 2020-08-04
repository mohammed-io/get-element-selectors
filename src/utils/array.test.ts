import { getOrderedSubArrays, isArrayElementsUnique, getShortestUniqueSubArrays, getCombos } from './array';

test('getOrderedSubArrays', () => {
  const expected = [['a'], ['b'], ['c'], ['a', 'b'], ['a', 'c'], ['b', 'c'], ['a', 'b', 'c']];

  expect(getOrderedSubArrays(['a', 'b', 'c'])).toEqual(expected);
  expect(getOrderedSubArrays(['a'])).toEqual([['a']]);
  expect(getOrderedSubArrays([])).toEqual([]);
});

test('isArrayElementsUnique', () => {
  const others = [
    ['a', 'b', 'c', 'd'],
    ['1', '2', '3'],
  ];

  expect(isArrayElementsUnique(['a', '1'], others)).toBe(true);
  expect(isArrayElementsUnique(['b', '2'], others)).toBe(true);
  expect(isArrayElementsUnique(['a', 'b'], others)).toBe(false);
  expect(isArrayElementsUnique(['a'], others)).toBe(false);
  expect(isArrayElementsUnique(['1'], others)).toBe(false);
});

test('getShortestUniqueSubArrays', () => {
  const test = [
    ['a', 'b', 'c'],
    ['1', '2', '3'],
  ];
  expect(getShortestUniqueSubArrays(['a', 'c', '1'], test)).toEqual([
    ['a', '1'],
    ['c', '1'],
  ]);
  expect(getShortestUniqueSubArrays(['a', '1', '2'], test)).toEqual([
    ['a', '1'],
    ['a', '2'],
  ]);

  const test2 = [
    ['a', 'b', 'c'],
    ['1', '2', '3'],
    ['1', 'a', '2'],
  ];
  expect(getShortestUniqueSubArrays(['a', '1', '2', '3'], test2)).toEqual([['a', '3']]);
});

test('getCombos', () => {
  const a = ['a', 'b', 'c'];
  const b = ['1', '2', '3'];
  const expected = [
    ['a', '1'],
    ['a', '2'],
    ['a', '3'],
    ['b', '1'],
    ['b', '2'],
    ['b', '3'],
    ['c', '1'],
    ['c', '2'],
    ['c', '3'],
  ];
  expect(getCombos(a, b)).toEqual(expected);
});
