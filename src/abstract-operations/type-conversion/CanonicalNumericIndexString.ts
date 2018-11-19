import { assert } from '../../assert';
import { StringValue } from '../../values/StringValue';
import { SameValue } from '../SameValue';
import { ToNumber } from './ToNumber';
import { Realm } from '../../environment/Realm';
import { ToString } from './ToString';

// ECMA-262 7.1.16
export function CanonicalNumericIndexString(realm: Realm, string: StringValue) {
  assert(string instanceof StringValue, 'Should be a string');

  if (string.value === '-0') return -0;

  const n = ToNumber(realm, string);

  if (!SameValue(ToString(realm, n), string)) return undefined;

  return n;
}
