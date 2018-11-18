import { Value } from '../values/Value';
import { Realm } from './Realm';

// ECMA-262 8.1.1
export abstract class EnvironmentRecord {
  __Realm: Realm;

  constructor(realm: Realm) {
    this.__Realm = realm;
  }

  abstract HasBinding(name: string): boolean;

  abstract CreateMutableBinding(name: string, deletable: boolean);

  abstract CreateImmutableBinding(name: string, strict: boolean);

  abstract InitializeBinding(name: string, value: Value);

  abstract SetMutableBinding(name: string, value: Value, strict: boolean);

  abstract GetBindingValue(name: string, strict: boolean);

  abstract DeleteBinding(name: string);

  abstract HasThisBinding(): boolean;

  abstract HasSuperBinding(): boolean;

  abstract WithBaseObject(): Value | undefined;
}
