import { ObjectValue } from '../values/ObjectValue';
import { StringValue } from '../values/StringValue';
import { SymbolValue } from '../values/SymbolValue';
import { assert } from '../assert';
import { IsPropertyKey } from './IsPropertyKey';
import { PropertyKeyValue } from '../types';
import { PropertyDescriptor } from '../values/PropertyDescriptor';
import { ValidateAndApplyPropertyDescriptor } from './ValidateAndApplyPropertyDescriptor';
import { Realm } from '../environment/Realm';

// ECMA-262 9.1.6.1
export function OrdinaryDefineOwnProperty(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  desc: PropertyDescriptor
) {
  const current = obj.__GetOwnProperty(propertyKey);
  const extensible = obj.__Extensible;
  return ValidateAndApplyPropertyDescriptor(realm, obj, propertyKey, extensible, desc, current);
}
