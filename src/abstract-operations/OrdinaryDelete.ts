import { ObjectValue } from '../values/ObjectValue';
import { assert } from '../assert';
import { PropertyKeyValue } from '../types';
import { IsPropertyKey } from './comparison/IsPropertyKey';

// ECMA-262 9.1.10.1
export function OrdinaryDelete(obj: ObjectValue, propertyKey: PropertyKeyValue) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const desc = obj.__GetOwnProperty(propertyKey);
  if (!desc) return true;

  if (desc.__Configurable && desc.__Configurable.value === true) {
    obj.__InternalDeletePropertyBinding(propertyKey);
    return true;
  }

  return false;
}
