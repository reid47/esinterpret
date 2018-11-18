import { ObjectValue } from '../values/ObjectValue';
import { StringValue } from '../values/StringValue';
import { SymbolValue } from '../values/SymbolValue';
import { assert } from '../assert';
import { IsPropertyKey } from './IsPropertyKey';
import { PropertyKeyValue } from '../types';
import { PropertyDescriptor } from '../values/PropertyDescriptor';

// ECMA-262 9.1.5.1
export function OrdinaryGetOwnProperty(obj: ObjectValue, propertyKey: PropertyKeyValue) {
  assert(IsPropertyKey(propertyKey), 'Property key should be either a string or a symbol');

  const propertyBinding = obj.__InternalGetPropertyBinding(propertyKey);
  if (!propertyBinding) return undefined;

  const descriptor = new PropertyDescriptor();
  // TODO: rest of this

  return descriptor;
}
