import { PropertyDescriptor } from '../values/PropertyDescriptor';
import { ObjectCreate } from './ObjectCreate';
import { Realm } from '../environment/Realm';
import { assert } from '../assert';
import { CreateDataProperty } from './CreateDataProperty';
import { ObjectValue } from '../values/ObjectValue';

// ECMA-262 6.2.5.5
export function ToPropertyDescriptor(realm: Realm, obj: ObjectValue) {
  if (!(obj instanceof ObjectValue)) {
    // TODO: abrupt completion
    throw new TypeError('Expected an object');
  }

  const desc = new PropertyDescriptor();

  // if (HasProperty(obj))
  // TODO: more here
}
