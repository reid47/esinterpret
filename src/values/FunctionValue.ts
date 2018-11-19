import { Value } from './Value';
import { Realm } from '../environment/Realm';
import { ObjectValue } from './ObjectValue';

export class FunctionValue extends ObjectValue {
  __Call: any; // TODO
  __BoundTargetFunction: any; // TODO

  __Construct() {
    // TODO
  }
}
