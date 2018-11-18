import { Value } from './Value';
import { BooleanValue } from './BooleanValue';

// ECMA-262 6.2.5
export class PropertyDescriptor {
  __Enumerable?: BooleanValue;
  __Configurable?: BooleanValue;

  // set for data property descriptors
  __Value?: Value;
  __Writable?: BooleanValue;

  // set for accessor property descriptors
  __Get?: any;
  __Set?: any;
}
