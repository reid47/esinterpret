import { Realm } from '../environment/Realm';
import { ObjectValue } from '../values/ObjectValue';
import { PropertyKeyValue } from '../types';
import { assert } from '../assert';
import { IsPropertyKey } from './IsPropertyKey';
import { NullValue } from '../values/NullValue';

// ECMA-262 9.1.11.1
export function OrdinaryOwnPropertyKeys(obj: ObjectValue) {
  const keys = [];

  // obj.properties.forEach((value, key) => {
  //   const stringKey = typeof key === 'string' ? key : key.value;

  // });

  for (const symbolKey of obj.symbols.keys()) {
    keys.push(symbolKey);
  }

  return keys;
}
