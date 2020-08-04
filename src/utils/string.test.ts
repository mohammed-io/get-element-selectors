import { escapeIdentifierIfNeeded } from './string';

test('escapeIdentifierIfNeeded', () => {
  expect(escapeIdentifierIfNeeded('hello')).toEqual('hello');
  expect(escapeIdentifierIfNeeded('-hello')).toEqual('-hello');
  expect(escapeIdentifierIfNeeded('你好')).toEqual('你好');
});
