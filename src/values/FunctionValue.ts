import { Value } from './Value';
import { Realm } from '../environment/Realm';
import { ObjectValue } from './ObjectValue';

export class FunctionValue extends ObjectValue {
  __BoundTargetFunction: any; // TODO

  __Call(): Value {
    // TODO
  }

  __Construct() {
    // TODO
  }
}
