import { StringValue } from '../values/StringValue';
import { SymbolValue } from '../values/SymbolValue';
import { ObjectValue } from '../values/ObjectValue';
import { PropertyKeyValue } from '../types';
import { assert } from '../assert';
import { IsPropertyKey } from './IsPropertyKey';

// ECMA-262 7.3.10
export function HasProperty(obj: ObjectValue, propertyKey: PropertyKeyValue) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');
  return obj.__HasProperty(propertyKey);
}
