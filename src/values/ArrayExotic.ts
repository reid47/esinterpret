import { ObjectValue } from './ObjectValue';
import { PropertyKeyValue } from '../types';
import { PropertyDescriptor } from './PropertyDescriptor';

export class ArrayExotic extends ObjectValue {
  // ECMA-262 9.4.2.1
  __DefineOwnProperty(propertyKey: PropertyKeyValue, desc: PropertyDescriptor) {
    // TODO: override
    return false;
  }
}
