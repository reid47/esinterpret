import { Realm } from '../../environment/Realm';
import { assert } from '../../assert';
import { ObjectValue } from '../../values/ObjectValue';
import { DefinePropertyOrThrow } from './DefinePropertyOrThrow';
import { PropertyDescriptor } from '../../values/PropertyDescriptor';
import { BooleanValue } from '../../values/BooleanValue';
import { IsAccessorDescriptor } from '../IsAccessorDescriptor';

// ECMA-262 7.3.14
export function SetIntegrityLevel(realm: Realm, obj: ObjectValue, level: 'sealed' | 'frozen') {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(level === 'sealed' || level === 'frozen', 'Should be a valid integrity level');

  const status = obj.__PreventExtensions();
  if (!status) return false;

  const keys = obj.__OwnPropertyKeys();

  if (level === 'sealed') {
    for (const key of keys) {
      const desc = new PropertyDescriptor();
      desc.__Configurable = new BooleanValue(realm, false);
      DefinePropertyOrThrow(realm, obj, key, desc);
    }
  } else {
    for (const key of keys) {
      const currentDesc = obj.__GetOwnProperty(key);
      if (currentDesc) {
        const desc = new PropertyDescriptor();

        if (IsAccessorDescriptor(currentDesc)) {
          desc.__Configurable = new BooleanValue(realm, false);
        } else {
          desc.__Configurable = new BooleanValue(realm, false);
          desc.__Writable = new BooleanValue(realm, false);
        }

        DefinePropertyOrThrow(realm, obj, key, desc);
      }
    }
  }

  return true;
}
