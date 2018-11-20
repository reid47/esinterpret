import { Value } from '../values/Value';
import { Realm } from './Realm';
import { StringValue } from '../values/StringValue';

// ECMA-262 8.1.1
export abstract class EnvironmentRecord {
  __Realm: Realm;

  constructor(realm: Realm) {
    this.__Realm = realm;
  }

  abstract HasBinding(name: StringValue): boolean;

  abstract CreateMutableBinding(name: StringValue, deletable: boolean);

  abstract CreateImmutableBinding(name: StringValue, strict: boolean);

  abstract InitializeBinding(name: StringValue, value: Value);

  abstract SetMutableBinding(name: StringValue, value: Value, strict: boolean);

  abstract GetBindingValue(name: StringValue, strict: boolean);

  abstract DeleteBinding(name: StringValue);

  abstract HasThisBinding(): boolean;

  abstract HasSuperBinding(): boolean;

  abstract WithBaseObject(): Value | undefined;
}
