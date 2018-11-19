import { StringValue } from '../../values/StringValue';
import { assert } from '../../assert';

// ECMA-262 7.2.9
export function IsStringPrefix(prefix: StringValue, string: StringValue) {
  assert(prefix instanceof StringValue, 'Should be a string');
  assert(string instanceof StringValue, 'Should be a string');

  const actualPrefix = string.value.substr(0, prefix.value.length);
  return actualPrefix === prefix.value;
}
