import { Value } from '../../values/Value';
import { Realm } from '../../environment/Realm';
import { PropertyKeyValue } from '../../types';
import { ToPrimitive } from './ToPrimitive';
import { SymbolValue } from '../../values/SymbolValue';
import { ToString } from './ToString';

// ECMA-262 7.1.14
export function ToPropertyKey(realm: Realm, argument: Value): PropertyKeyValue {
  const key = ToPrimitive(realm, argument, 'string');

  if (key instanceof SymbolValue) return key;

  return ToString(realm, key);
}
