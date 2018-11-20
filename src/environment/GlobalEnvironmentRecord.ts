import { EnvironmentRecord } from './EnvironmentRecord';
import { ObjectEnvironmentRecord } from './ObjectEnvironmentRecord';
import { Value } from '../values/Value';
import { DeclarativeEnvironmentRecord } from './DeclarativeEnvironmentRecord';
import { StringValue } from '../values/StringValue';
import { UndefinedValue } from '../values/UndefinedValue';
import { PropertyDescriptor } from '../values/PropertyDescriptor';
import { BooleanValue } from '../values/BooleanValue';
import * as Ops from '../operations';

// ECMA-262 8.1.1.4
export class GlobalEnvironmentRecord extends EnvironmentRecord {
  __ObjectRecord: ObjectEnvironmentRecord;
  __GlobalThisValue: Value;
  __DeclarativeRecord: DeclarativeEnvironmentRecord;
  __VarNames: string[];

  // ECMA-262 8.1.1.4.1
  HasBinding(name: StringValue) {
    const envRec = this;

    const declRec = envRec.__DeclarativeRecord;
    if (declRec.HasBinding(name)) return true;

    const objRec = envRec.__ObjectRecord;
    return objRec.HasBinding(name);
  }

  // ECMA-262 8.1.1.4.2
  CreateMutableBinding(name: StringValue, deletable: boolean) {
    const envRec = this;

    const declRec = envRec.__DeclarativeRecord;
    if (declRec.HasBinding(name)) {
      throw new TypeError(`Already defined: '${name.value}'`);
    }

    return declRec.CreateMutableBinding(name, deletable);
  }

  // ECMA-262 8.1.1.4.3
  CreateImmutableBinding(name: StringValue, strict: boolean) {
    const envRec = this;

    const declRec = envRec.__DeclarativeRecord;
    if (declRec.HasBinding(name)) {
      throw new TypeError(`Already defined: '${name.value}'`);
    }

    return declRec.CreateImmutableBinding(name, strict);
  }

  // ECMA-262 8.1.1.4.4
  InitializeBinding(name: StringValue, value: Value) {
    const envRec = this;

    const declRec = envRec.__DeclarativeRecord;
    if (declRec.HasBinding(name)) {
      return declRec.InitializeBinding(name, value);
    }

    const objRec = envRec.__ObjectRecord;
    return objRec.InitializeBinding(name, value);
  }

  // ECMA-262 8.1.1.4.5
  SetMutableBinding(name: StringValue, value: Value, strict: boolean) {
    const envRec = this;

    const declRec = envRec.__DeclarativeRecord;
    if (declRec.HasBinding(name)) {
      return declRec.SetMutableBinding(name, value, strict);
    }

    const objRec = envRec.__ObjectRecord;
    return objRec.SetMutableBinding(name, value, strict);
  }

  // ECMA-262 8.1.1.4.6
  GetBindingValue(name: StringValue, strict: boolean) {
    const envRec = this;

    const declRec = envRec.__DeclarativeRecord;
    if (declRec.HasBinding(name)) {
      return declRec.GetBindingValue(name, strict);
    }

    const objRec = envRec.__ObjectRecord;
    return objRec.GetBindingValue(name, strict);
  }

  // ECMA-262 8.1.1.4.7
  DeleteBinding(name: StringValue) {
    const envRec = this;

    const declRec = envRec.__DeclarativeRecord;
    if (declRec.HasBinding(name)) {
      return declRec.DeleteBinding(name);
    }

    const objRec = envRec.__ObjectRecord;
    const globalObject = objRec.object;
    const existingProp = Ops.HasOwnProperty(globalObject, name);

    if (existingProp) {
      const status = objRec.DeleteBinding(name);

      if (status) {
        const varNames = envRec.__VarNames;
        const nameIndex = varNames.indexOf(name.value);
        if (nameIndex > -1) {
          varNames.splice(nameIndex, 1);
        }
      }

      return status;
    }

    return true;
  }

  // ECMA-262 8.1.1.4.8
  HasThisBinding() {
    return true;
  }

  // ECMA-262 8.1.1.4.9
  HasSuperBinding() {
    return false;
  }

  // ECMA-262 8.1.1.4.10
  WithBaseObject() {
    return undefined;
  }

  // ECMA-262 8.1.1.4.11
  GetThisBinding() {
    const envRec = this;
    return envRec.__GlobalThisValue;
  }

  // ECMA-262 8.1.1.4.12
  HasVarDeclaration(name: StringValue) {
    const envRec = this;
    const varDeclaredNames = envRec.__VarNames;
    return varDeclaredNames.indexOf(name.value) > -1;
  }

  // ECMA-262 8.1.1.4.13
  HasLexicalDeclaration(name: StringValue) {
    const envRec = this;
    const declRec = envRec.__DeclarativeRecord;
    return declRec.HasBinding(name);
  }

  // ECMA-262 8.1.1.4.14
  HasRestrictedGlobalProperty(name: StringValue) {
    const envRec = this;
    const objRec = envRec.__ObjectRecord;
    const globalObject = objRec.object;

    const existingProp = globalObject.__GetOwnProperty(name);
    if (!existingProp) return false;
    if (existingProp.__Configurable && existingProp.__Configurable.value === true) return false;

    return true;
  }

  // ECMA-262 8.1.1.4.15
  CanDeclareGlobalVar(name: StringValue) {
    const envRec = this;
    const objRec = envRec.__ObjectRecord;
    const globalObject = objRec.object;

    const hasProperty = Ops.HasOwnProperty(globalObject, name);
    if (hasProperty) return true;

    return Ops.IsExtensible(globalObject);
  }

  // ECMA-262 8.1.1.4.16
  CanDeclareGlobalFunction(name: StringValue) {
    const envRec = this;
    const objRec = envRec.__ObjectRecord;
    const globalObject = objRec.object;

    const existingProp = globalObject.__GetOwnProperty(name);
    if (!existingProp) return Ops.IsExtensible(globalObject);
    if (existingProp.__Configurable && existingProp.__Configurable.value === true) return true;
    if (
      Ops.IsDataDescriptor(existingProp) &&
      existingProp.__Writable &&
      existingProp.__Writable.value === true &&
      existingProp.__Enumerable &&
      existingProp.__Enumerable.value === true
    ) {
      return true;
    }

    return false;
  }

  // ECMA-262 8.1.1.4.17
  CreateGlobalVarBinding(name: StringValue, deletable: boolean) {
    const envRec = this;
    const objRec = envRec.__ObjectRecord;
    const globalObject = objRec.object;

    const hasProperty = Ops.HasOwnProperty(globalObject, name);
    const extensible = Ops.IsExtensible(globalObject);
    if (!hasProperty && extensible) {
      objRec.CreateMutableBinding(name, deletable);
      objRec.InitializeBinding(name, new UndefinedValue(envRec.__Realm));
    }

    const varDeclaredNames = envRec.__VarNames;
    if (varDeclaredNames.indexOf(name.value) === -1) {
      varDeclaredNames.push(name.value);
    }
  }

  // ECMA-262 8.1.1.4.18
  CreateGlobalFunctionBinding(name: StringValue, value: Value, deletable: boolean) {
    const envRec = this;
    const objRec = envRec.__ObjectRecord;
    const globalObject = objRec.object;

    const existingProp = globalObject.__GetOwnProperty(name);
    const desc = new PropertyDescriptor();

    if (
      !existingProp ||
      (existingProp.__Configurable && existingProp.__Configurable.value === true)
    ) {
      desc.__Value = value;
      desc.__Writable = new BooleanValue(envRec.__Realm, true);
      desc.__Enumerable = new BooleanValue(envRec.__Realm, true);
      desc.__Configurable = new BooleanValue(envRec.__Realm, deletable);
    } else {
      desc.__Value = value;
    }

    Ops.DefinePropertyOrThrow(envRec.__Realm, globalObject, name, desc);

    Ops.Set(envRec.__Realm, globalObject, name, value, new BooleanValue(envRec.__Realm, false));

    const varDeclaredNames = envRec.__VarNames;
    if (varDeclaredNames.indexOf(name.value) === -1) {
      varDeclaredNames.push(name.value);
    }
  }
}
