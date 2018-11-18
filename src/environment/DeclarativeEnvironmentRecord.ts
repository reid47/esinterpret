import { EnvironmentRecord } from './EnvironmentRecord';
import { Realm } from './Realm';
import { assert } from '../assert';
import { Binding } from './Binding';
import { Value } from '../values/Value';

// ECMA-262 8.1.1.1
export class DeclarativeEnvironmentRecord extends EnvironmentRecord {
  bindings: { [name: string]: Binding };

  constructor(realm: Realm) {
    super(realm);
    this.bindings = Object.create(null);
  }

  // ECMA-262 8.1.1.1.1
  HasBinding(name: string) {
    const envRec = this;
    if (envRec[name]) return true;
    return false;
  }

  // ECMA-262 8.1.1.1.2
  CreateMutableBinding(name: string, deletable: boolean) {
    const envRec = this;

    assert(!envRec[name], `Environment record already has a binding for '${name}'`);

    envRec[name] = new Binding({
      name,
      mutable: true,
      initialized: false,
      deletable,
      strict: false
    });

    // return NormalCompletion(empty)
  }

  // ECMA-262 8.1.1.1.3
  CreateImmutableBinding(name: string, strict: boolean) {
    const envRec = this;

    assert(!envRec[name], `Environment record already has a binding for '${name}'`);

    envRec[name] = new Binding({
      name,
      mutable: false,
      initialized: false,
      deletable: false,
      strict
    });

    // return NormalCompletion(empty)
  }

  // ECMA-262 8.1.1.1.4
  InitializeBinding(name: string, value: Value) {
    const envRec = this;

    assert(envRec[name], `Environment record does not have a binding for '${name}'`);
    assert(!envRec[name].initialized, `Binding for '${name}' is already initialized`);

    envRec[name].initialize(value);

    // return NormalCompletion(empty)
  }

  // ECMA-262 8.1.1.1.5
  SetMutableBinding(name: string, value: Value, strict: boolean) {
    const envRec = this;
    const binding = envRec[name];

    if (!binding) {
      if (strict) {
        throw new ReferenceError(`Cannot set value of uninitialized: '${name}'`);
      }

      envRec.CreateMutableBinding(name, true);
      envRec.InitializeBinding(name, value);
      // return NormalCompletion(empty)
    }

    if (binding.strict) {
      strict = true;
    }

    if (!binding.initialized) {
      throw new ReferenceError(`Cannot set value of uninitialized: '${name}'`);
    } else if (binding.mutable) {
      binding.value = value;
    } else {
      assert(binding.mutable === false, 'Should be changing value of an immutable binding');
      if (strict) throw new TypeError(`Cannot change value of immutable binding: ${name}`);
    }

    // return NormalCompletion(empty)
  }

  // ECMA-262 8.1.1.1.6
  GetBindingValue(name: string, strict: boolean) {
    const envRec = this;

    assert(envRec[name], `Environment record does not have a binding for '${name}'`);

    if (!envRec[name].initialized) {
      throw new ReferenceError(`Cannot get value of uninitialized: '${name}'`);
    }

    return envRec[name].value;
  }

  // ECMA-262 8.1.1.1.7
  DeleteBinding(name: string) {
    const envRec = this;

    assert(envRec[name], `Environment record does not have a binding for '${name}'`);

    if (!envRec[name].deletable) return false;

    delete envRec[name];
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
