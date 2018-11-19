import { ObjectValue } from '../values/ObjectValue';
import { assert } from '../assert';
import { IsPropertyKey } from './comparison/IsPropertyKey';
import { IsDataDescriptor } from './IsDataDescriptor';
import { IsAccessorDescriptor } from './IsAccessorDescriptor';
import { PropertyKeyValue } from '../types';
import { PropertyDescriptor } from '../values/PropertyDescriptor';

// ECMA-262 9.1.5.1
export function OrdinaryGetOwnProperty(obj: ObjectValue, propertyKey: PropertyKeyValue) {
  assert(IsPropertyKey(propertyKey), 'Property key should be either a string or a symbol');

  const propertyBinding = obj.__InternalGetPropertyBinding(propertyKey);
  if (!propertyBinding) return undefined;

  const descriptor = new PropertyDescriptor();

  if (IsDataDescriptor(propertyBinding)) {
    descriptor.__Value = propertyBinding.__Value;
    descriptor.__Writable = propertyBinding.__Writable;
  } else if (IsAccessorDescriptor(propertyBinding)) {
    descriptor.__Get = propertyBinding.__Get;
    descriptor.__Set = propertyBinding.__Set;
  }

  descriptor.__Enumerable = propertyBinding.__Enumerable;
  descriptor.__Configurable = propertyBinding.__Configurable;

  return descriptor;
}
