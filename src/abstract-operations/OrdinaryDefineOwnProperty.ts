import { ObjectValue } from '../values/ObjectValue';
import { StringValue } from '../values/StringValue';
import { SymbolValue } from '../values/SymbolValue';
import { assert } from '../assert';
import { IsPropertyKey } from './IsPropertyKey';
import { PropertyKeyValue } from '../types';

// ECMA-262 9.1.6.1
export function OrdinaryDefineOwnProperty(obj: ObjectValue, propertyKey: PropertyKeyValue) {
  const current = obj.__GetOwnProperty();
}
