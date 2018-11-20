import { EnvironmentRecord } from './EnvironmentRecord';
import { Realm } from './Realm';
import { assert } from '../assert';
import { Binding } from '../values/Binding';
import { Value } from '../values/Value';
import { StringValue } from '../values/StringValue';

// ECMA-262 8.1.1.1
export class DeclarativeEnvironmentRecord extends EnvironmentRecord {
  bindings: { [name: string]: Binding };

  constructor(realm: Realm) {
    super(realm);
    this.bindings = Object.create(null);
  }

  // ECMA-262 8.1.1.1.1
  HasBinding(name: StringValue) {
    const envRec = this;
    if (envRec[name.value]) return true;
    return false;
  }

  // ECMA-262 8.1.1.1.2
  CreateMutableBinding(name: StringValue, deletable: boolean) {
    const envRec = this;

    assert(!envRec[name.value], `Environment record already has a binding for '${name.value}'`);

    envRec[name.value] = new Binding({
      name: name.value,
      mutable: true,
      initialized: false,
      deletable,
      strict: false
    });

    // return NormalCompletion(empty)
  }

  // ECMA-262 8.1.1.1.3
  CreateImmutableBinding(name: StringValue, strict: boolean) {
    const envRec = this;

    assert(!envRec[name.value], `Environment record already has a binding for '${name.value}'`);

    envRec[name.value] = new Binding({
      name: name.value,
      mutable: false,
      initialized: false,
      deletable: false,
      strict
    });

    // return NormalCompletion(empty)
  }

  // ECMA-262 8.1.1.1.4
  InitializeBinding(name: StringValue, value: Value) {
    const envRec = this;

    assert(envRec[name.value], `Environment record does not have a binding for '${name.value}'`);
    assert(!envRec[name.value].initialized, `Binding for '${name.value}' is already initialized`);

    envRec[name.value].initialize(value);

    // return NormalCompletion(empty)
  }

  // ECMA-262 8.1.1.1.5
  SetMutableBinding(name: StringValue, value: Value, strict: boolean) {
    const envRec = this;
    const binding = envRec[name.value];

    if (!binding) {
      if (strict) {
        throw new ReferenceError(`Cannot set value of uninitialized: '${name.value}'`);
      }

      envRec.CreateMutableBinding(name, true);
      envRec.InitializeBinding(name, value);
      // return NormalCompletion(empty)
    }

    if (binding.strict) {
      strict = true;
    }

    if (!binding.initialized) {
      throw new ReferenceError(`Cannot set value of uninitialized: '${name.value}'`);
    } else if (binding.mutable) {
      binding.value = value;
    } else {
      assert(binding.mutable === false, 'Should be changing value of an immutable binding');
      if (strict) throw new TypeError(`Cannot change value of immutable binding: ${name.value}`);
    }

    // return NormalCompletion(empty)
  }

  // ECMA-262 8.1.1.1.6
  GetBindingValue(name: StringValue, strict: boolean) {
    const envRec = this;

    assert(envRec[name.value], `Environment record does not have a binding for '${name.value}'`);

    if (!envRec[name.value].initialized) {
      throw new ReferenceError(`Cannot get value of uninitialized: '${name.value}'`);
    }

    return envRec[name.value].value;
  }

  // ECMA-262 8.1.1.1.7
  DeleteBinding(name: StringValue) {
    const envRec = this;

    assert(envRec[name.value], `Environment record does not have a binding for '${name.value}'`);

    if (!envRec[name.value].deletable) return false;

    delete envRec[name.value];
    return true;
  }

  // ECMA-262 8.1.1.1.8
  HasThisBinding() {
    return false;
  }

  // ECMA-262 8.1.1.1.9
  HasSuperBinding() {
    return false;
  }

  // ECMA-262 8.1.1.1.10
  WithBaseObject() {
    return undefined;
  }
}
