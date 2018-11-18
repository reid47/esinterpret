import { NumberValue } from '../values/NumberValue';
import { Value } from '../values/Value';
import { PropertyKeyValue } from '../types';
import { assert } from '../assert';
import { IsPropertyKey } from './IsPropertyKey';
import { SymbolValue } from '../values/SymbolValue';
import { StringValue } from '../values/StringValue';
import { SameValue } from './SameValue';

// ECMA-262 7.1.16
export function CanonicalNumericIndexString(string: StringValue) {
  assert(string instanceof StringValue, 'Should be a string');

  if (string.value === '-0') return -0;

  const n = ToNumber(string);

  if (!SameValue(ToString(n), string)) return undefined;

  return n;
}
