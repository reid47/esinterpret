import { Realm } from '../../environment/Realm';
import { Value } from '../../values/Value';
import { FunctionValue } from '../../values/FunctionValue';
import { IsCallable } from '../comparison/IsCallable';
import { ObjectValue } from '../../values/ObjectValue';
import { assert } from '../../assert';
import { StringValue } from '../../values/StringValue';
import { Get } from './Get';
import { CreateArrayFromList } from './CreateArrayFromList';

// ECMA-262 7.3.21
export function EnumerableOwnPropertyNames(
  realm: Realm,
  obj: ObjectValue,
  kind: 'key' | 'value' | 'key+value'
) {
  assert(obj instanceof ObjectValue, 'should be an object');

  const ownKeys = obj.__OwnPropertyKeys();

  const properties = [];

  for (const key of ownKeys) {
    if (key instanceof StringValue) {
      const desc = obj.__GetOwnProperty(key);

      if (desc && desc.__Enumerable && desc.__Enumerable.value === true) {
        if (kind === 'key') {
          properties.push(key);
        } else {
          const value = Get(obj, key);
          if (kind === 'value') {
            properties.push(value);
          } else {
            assert(kind === 'key+value', 'should have kind key+value');

            const entry = CreateArrayFromList(realm, [key, value]);
            properties.push(entry);
          }
        }
      }
    }
  }

  return properties;
}
