import { EnvironmentRecord } from './EnvironmentRecord';
import { Realm } from './Realm';
import { HasProperty } from '../abstract-operations/objects/HasProperty';
import { Get } from '../abstract-operations/objects/Get';
import { ObjectValue } from '../values/ObjectValue';
import { StringValue } from '../values/StringValue';
import { Value } from '../values/Value';
import { ToBoolean } from '../abstract-operations/type-conversion/ToBoolean';
import { DefinePropertyOrThrow } from '../abstract-operations/objects/DefinePropertyOrThrow';
import { PropertyDescriptor } from '../values/PropertyDescriptor';
import { UndefinedValue } from '../values/UndefinedValue';
import { BooleanValue } from '../values/BooleanValue';
import { assert } from '../assert';
import { Set } from '../abstract-operations/objects/Set';

// ECMA-262 8.1.1.2
export class ObjectEnvironmentRecord extends EnvironmentRecord {
  object: ObjectValue;
  withEnvironment: boolean;

  constructor(realm: Realm) {
    super(realm);
    this.withEnvironment = false;
  }

  // ECMA-262 8.1.1.2.1
  HasBinding(name: StringValue): boolean {
    const envRec = this;
    const bindings = this.object;
    const foundBinding = HasProperty(bindings, name);

    if (!foundBinding) return false;
    if (!envRec.withEnvironment) return true;

    const unscopables = Get(bindings, envRec.__Realm.__Intrinsics.__Symbol_unscopables);
    if (unscopables instanceof ObjectValue) {
      const blocked = ToBoolean(envRec.__Realm, Get(unscopables, name));
      if (blocked.value === true) return false;
    }

    return true;
  }

  // ECMA-262 8.1.1.2.2
  CreateMutableBinding(name: StringValue, deletable: boolean) {
    const envRec = this;
    const bindings = this.object;

    const desc = new PropertyDescriptor();
    desc.__Value = new UndefinedValue(envRec.__Realm);
    desc.__Writable = new BooleanValue(envRec.__Realm, true);
    desc.__Enumerable = new BooleanValue(envRec.__Realm, true);
    desc.__Configurable = new BooleanValue(envRec.__Realm, deletable);

    return DefinePropertyOrThrow(envRec.__Realm, bindings, name, desc);
  }

  // ECMA-262 8.1.1.2.3
  CreateImmutableBinding(name: StringValue, strict: boolean) {
    assert(false, 'should not be called for object environment records');
  }

  // ECMA-262 8.1.1.2.4
  InitializeBinding(name: StringValue, value: Value) {
    const envRec = this;

    return envRec.SetMutableBinding(name, value, false);
  }

  // ECMA-262 8.1.1.2.5
  SetMutableBinding(name: StringValue, value: Value, strict: boolean) {
    const envRec = this;
    const bindings = envRec.object;
    return Set(envRec.__Realm, bindings, name, value, new BooleanValue(envRec.__Realm, strict));
  }

  // ECMA-262 8.1.1.2.6
  GetBindingValue(name: StringValue, strict: boolean) {
    const envRec = this;
    const bindings = envRec.object;

    const value = HasProperty(bindings, name);
    if (!value) {
      if (!strict) return false;

      throw new ReferenceError('Could not get binding value');
    }

    return Get(bindings, name);
  }

  // ECMA-262 8.1.1.2.7
  DeleteBinding(name: StringValue) {
    const envRec = this;
    const bindings = envRec.object;
    return bindings.__Delete(name);
  }

  // ECMA-262 8.1.1.2.8
  HasThisBinding(): boolean {
    return false;
  }

  // ECMA-262 8.1.1.2.9
  HasSuperBinding(): boolean {
    return false;
  }

  // ECMA-262 8.1.1.2.10
  WithBaseObject(): Value | undefined {
    const envRec = this;

    if (envRec.withEnvironment) return envRec.object;

    return new UndefinedValue(envRec.__Realm);
  }
}
