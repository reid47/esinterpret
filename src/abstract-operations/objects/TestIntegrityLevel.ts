import { Realm } from '../../environment/Realm';
import { assert } from '../../assert';
import { ObjectValue } from '../../values/ObjectValue';
import { IsExtensible } from '../comparison/IsExtensible';
import { IsDataDescriptor } from '../IsDataDescriptor';

// ECMA-262 7.3.15
export function TestIntegrityLevel(realm: Realm, obj: ObjectValue, level: 'sealed' | 'frozen') {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(level === 'sealed' || level === 'frozen', 'Should be a valid integrity level');

  const status = IsExtensible(obj);
  if (status) return false;

  const keys = obj.__OwnPropertyKeys();

  for (const key of keys) {
    const currentDesc = obj.__GetOwnProperty(key);

    if (currentDesc) {
      if (currentDesc.__Configurable && currentDesc.__Configurable.value === true) {
        return false;
      }

      if (level === 'frozen' && IsDataDescriptor(currentDesc)) {
        if (currentDesc.__Writable && currentDesc.__Writable.value === true) {
          return false;
        }
      }
    }
  }

  return true;
}
