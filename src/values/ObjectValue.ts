import { Value } from './Value';
import { NullValue } from './NullValue';
import { BooleanValue } from './BooleanValue';

export class ObjectValue extends Value {
  __Prototype: ObjectValue | NullValue;
  __Extensible: BooleanValue;
}
