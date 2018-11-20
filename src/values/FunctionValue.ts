import { Value } from './Value';
import { ObjectValue } from './ObjectValue';
import { UndefinedValue } from './UndefinedValue';

export class FunctionValue extends ObjectValue {
  __BoundTargetFunction: any; // TODO

  __Call(thisValue: Value, argumentsList: Value[] = []) {
    // TODO
    return new UndefinedValue(this.__Realm);
  }

  __Construct(a: any, b: any) {
    // TODO
    return new UndefinedValue(this.__Realm);
  }
}
