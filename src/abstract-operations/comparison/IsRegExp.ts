import { Value } from '../../values/Value';
import { ObjectValue } from '../../values/ObjectValue';
import { Realm } from '../../environment/Realm';
import { Get } from '../objects/Get';
import { ToBoolean } from '../type-conversion/ToBoolean';

// ECMA-262 7.2.8
export function IsRegExp(realm: Realm, value: Value) {
  if (!(value instanceof ObjectValue)) return false;

  const matcher = Get(value, realm.__Intrinsics.__Symbol_match);
  if (matcher) return ToBoolean(realm, matcher);

  if (value.__RegExpMatcher) return true;

  return true;
}
