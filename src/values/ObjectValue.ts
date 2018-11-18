import { Value } from './Value';
import { NullValue } from './NullValue';
import { BooleanValue } from './BooleanValue';
import { OrdinaryGetPrototypeOf } from '../abstract-operations/OrdinaryGetPrototypeOf';
import { OrdinarySetPrototypeOf } from '../abstract-operations/OrdinarySetPrototypeOf';
import { OrdinaryIsExtensible } from '../abstract-operations/OrdinaryIsExtensible';
import { Realm } from '../environment/Realm';
import { OrdinaryPreventExtensions } from '../abstract-operations/OrdinaryPreventExtensions';
import { OrdinaryGetOwnProperty } from '../abstract-operations/OrdinaryGetOwnProperty';
import { OrdinaryDefineOwnProperty } from '../abstract-operations/OrdinaryDefineOwnProperty';
import { StringValue } from './StringValue';
import { SymbolValue } from './SymbolValue';
import { PropertyKeyValue } from '../types';
import { assert } from '../assert';
import { PropertyDescriptor } from './PropertyDescriptor';
import { OrdinaryHasProperty } from '../abstract-operations/OrdinaryHasProperty';
import { OrdinaryGet } from '../abstract-operations/OrdinaryGet';
import { OrdinarySet } from '../abstract-operations/OrdinarySet';
import { OrdinaryDelete } from '../abstract-operations/OrdinaryDelete';

export class ObjectValue extends Value {
  __Prototype: ObjectValue | NullValue;
  __Extensible: BooleanValue;
  properties: Map<string | StringValue, any>;
  symbols: Map<SymbolValue, any>;

  constructor(realm: Realm, proto?: ObjectValue | NullValue) {
    super(realm);
    this.__Prototype = proto || new NullValue(realm);
    this.properties = new Map();
    this.symbols = new Map();
  }

  // ECMA-262 9.1.1
  __GetPrototypeOf() {
    return OrdinaryGetPrototypeOf(this);
  }

  // ECMA-262 9.1.2
  __SetPrototypeOf(newProto: Value) {
    return OrdinarySetPrototypeOf(this, newProto);
  }

  // ECMA-262 9.1.3
  __IsExtensible() {
    return OrdinaryIsExtensible(this);
  }

  // ECMA-262 9.1.4
  __PreventExtensions() {
    return OrdinaryPreventExtensions(this.__Realm, this);
  }

  // ECMA-262 9.1.5
  __GetOwnProperty(propertyKey: PropertyKeyValue) {
    return OrdinaryGetOwnProperty(this, propertyKey);
  }

  // ECMA-262 9.1.6
  __DefineOwnProperty(propertyKey: PropertyKeyValue, desc: PropertyDescriptor) {
    return OrdinaryDefineOwnProperty(this.__Realm, this, propertyKey, desc);
  }

  // ECMA-262 9.1.7
  __HasProperty(propertyKey: PropertyKeyValue) {
    return OrdinaryHasProperty(this.__Realm, this, propertyKey);
  }

  // ECMA-262 9.1.8
  __Get(propertyKey: PropertyKeyValue, receiver: ObjectValue) {
    return OrdinaryGet(this, propertyKey, receiver);
  }

  // ECMA-262 9.1.9
  __Set(propertyKey: PropertyKeyValue, value: Value, receiver: ObjectValue) {
    return OrdinarySet(this.__Realm, this, propertyKey, value, receiver);
  }

  // ECMA-262 9.1.10
  __Delete(propertyKey: PropertyKeyValue) {
    return OrdinaryDelete(this, propertyKey);
  }

  // ECMA-262 9.1.11
  __OwnPropertyKeys() {
    return OrdinaryOwnPropertyKeys(this);
  }

  __InternalGetPropertyBinding(propertyKey: PropertyKeyValue) {
    if (typeof propertyKey === 'string') {
      return this.properties.get(propertyKey);
    }

    if (propertyKey instanceof StringValue) {
      return this.properties.get(propertyKey.value);
    }

    if (propertyKey instanceof SymbolValue) {
      return this.symbols.get(propertyKey);
    }

    assert(false, 'Could not get property binding');
  }

  __InternalSetPropertyBinding(propertyKey: PropertyKeyValue, desc: PropertyDescriptor) {
    if (typeof propertyKey === 'string') {
      return this.properties.set(propertyKey, desc);
    }

    if (propertyKey instanceof StringValue) {
      return this.properties.set(propertyKey.value, desc);
    }

    if (propertyKey instanceof SymbolValue) {
      return this.symbols.set(propertyKey, desc);
    }

    assert(false, 'Could not set property binding');
  }

  __InternalDeletePropertyBinding(propertyKey: PropertyKeyValue) {
    if (typeof propertyKey === 'string') {
      return this.properties.delete(propertyKey);
    }

    if (propertyKey instanceof StringValue) {
      return this.properties.delete(propertyKey.value);
    }

    if (propertyKey instanceof SymbolValue) {
      return this.symbols.delete(propertyKey);
    }

    assert(false, 'Could not delete property binding');
  }
}
