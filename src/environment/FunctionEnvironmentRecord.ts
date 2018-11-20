import { Realm } from './Realm';
import { assert } from '../assert';
import { Value } from '../values/Value';
import { DeclarativeEnvironmentRecord } from './DeclarativeEnvironmentRecord';
import { FunctionValue } from '../values/FunctionValue';
import { ObjectValue } from '../values/ObjectValue';

// ECMA-262 8.1.1.3
export class FunctionEnvironmentRecord extends DeclarativeEnvironmentRecord {
  __ThisValue: Value;
  __ThisBindingStatus: 'lexical' | 'initialized' | 'uninitialized';
  __FunctionObject: FunctionValue;
  __HomeObject?: ObjectValue;
  __NewTarget?: ObjectValue;

  constructor(realm: Realm) {
    super(realm);
  }

  // ECMA-262 8.1.1.3.1
  BindThisValue(value: Value) {
    const envRec = this;
    assert(envRec.__ThisBindingStatus !== 'lexical', 'should not be arrow function');

    if (envRec.__ThisBindingStatus === 'initialized') {
      throw new ReferenceError('this is already bound');
    }

    envRec.__ThisValue = value;
    envRec.__ThisBindingStatus = 'initialized';

    return value;
  }

  // ECMA-262 8.1.1.3.2
  HasThisBinding() {
    const envRec = this;
    return envRec.__ThisBindingStatus !== 'lexical';
  }

  // ECMA-262 8.1.1.3.3
  HasSuperBinding() {
    const envRec = this;
    if (envRec.__ThisBindingStatus === 'lexical') return false;
    return envRec.__HomeObject !== undefined;
  }

  // ECMA-262 8.1.1.3.4
  GetThisBinding() {
    const envRec = this;
    assert(envRec.__ThisBindingStatus !== 'lexical', 'should not be arrow function');

    if (envRec.__ThisBindingStatus === 'uninitialized') {
      throw new ReferenceError('this is not defined');
    }

    return envRec.__ThisValue;
  }

  // ECMA-262 8.1.1.3.5
  GetSuperBase() {
    const envRec = this;

    const home = envRec.__HomeObject;
    if (home === undefined) return undefined;

    assert(home instanceof ObjectValue, 'should be an object if defined');
    return home.__GetPrototypeOf();
  }
}
