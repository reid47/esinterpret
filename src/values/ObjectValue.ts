import { Value } from './Value';
import { NullValue } from './NullValue';
import { BooleanValue } from './BooleanValue';
import { Realm } from '../environment/Realm';
import { StringValue } from './StringValue';
import { SymbolValue } from './SymbolValue';
import { PropertyKeyValue } from '../types';
import { assert } from '../assert';
import { PropertyDescriptor } from './PropertyDescriptor';
import { NumberValue } from './NumberValue';
import * as Ops from '../operations';

export class ObjectValue extends Value {
  __Prototype: ObjectValue | NullValue;
  __Extensible: BooleanValue;

  properties: Map<StringValue, any>;
  symbols: Map<SymbolValue, any>;

  // Set when creating an object from a boolean (e.g. ECMA-262 7.1.13)
  __BooleanData?: BooleanValue;

  // Set when creating an object from a number (e.g. ECMA-262 7.1.13)
  __NumberData?: NumberValue;

  // Set when creating an object from a string (e.g. ECMA-262 7.1.13)
  __StringData?: StringValue;

  // Set when creating an object from a symbol (e.g. ECMA-262 7.1.13)
  __SymbolData?: SymbolValue;

  // Set for RegExps
  __RegExpMatcher?: Value;

  constructor(realm: Realm, proto?: ObjectValue | NullValue) {
    super(realm);
    this.__Prototype = proto || new NullValue(realm);
    this.properties = new Map();
    this.symbols = new Map();
  }

  // ECMA-262 9.1.1
  __GetPrototypeOf() {
    return Ops.OrdinaryGetPrototypeOf(this);
  }

  // ECMA-262 9.1.2
  __SetPrototypeOf(newProto: Value) {
    return Ops.OrdinarySetPrototypeOf(this, newProto);
  }

  // ECMA-262 9.1.3
  __IsExtensible() {
    return Ops.OrdinaryIsExtensible(this);
  }

  // ECMA-262 9.1.4
  __PreventExtensions() {
    return Ops.OrdinaryPreventExtensions(this.__Realm, this);
  }

  // ECMA-262 9.1.5
  __GetOwnProperty(propertyKey: PropertyKeyValue) {
    return Ops.OrdinaryGetOwnProperty(this, propertyKey);
  }

  // ECMA-262 9.1.6
  __DefineOwnProperty(propertyKey: PropertyKeyValue, desc: PropertyDescriptor) {
    return Ops.OrdinaryDefineOwnProperty(this.__Realm, this, propertyKey, desc);
  }

  // ECMA-262 9.1.7
  __HasProperty(propertyKey: PropertyKeyValue): boolean {
    return Ops.OrdinaryHasProperty(this.__Realm, this, propertyKey);
  }

  // ECMA-262 9.1.8
  __Get(propertyKey: PropertyKeyValue, receiver: ObjectValue) {
    return Ops.OrdinaryGet(this.__Realm, this, propertyKey, receiver);
  }

  // ECMA-262 9.1.9
  __Set(propertyKey: PropertyKeyValue, value: Value, receiver: ObjectValue) {
    return Ops.OrdinarySet(this.__Realm, this, propertyKey, value, receiver);
  }

  // ECMA-262 9.1.10
  __Delete(propertyKey: PropertyKeyValue) {
    return Ops.OrdinaryDelete(this, propertyKey);
  }

  // ECMA-262 9.1.11
  __OwnPropertyKeys(): PropertyKeyValue[] {
    return Ops.OrdinaryOwnPropertyKeys(this);
  }

  __InternalGetPropertyBinding(propertyKey: PropertyKeyValue) {
    if (propertyKey instanceof StringValue) {
      return this.properties.get(propertyKey);
    }

    if (propertyKey instanceof SymbolValue) {
      return this.symbols.get(propertyKey);
    }

    assert(false, 'Could not get property binding');
  }

  __InternalSetPropertyBinding(propertyKey: PropertyKeyValue, desc: PropertyDescriptor) {
    if (propertyKey instanceof StringValue) {
      return this.properties.set(propertyKey, desc);
    }

    if (propertyKey instanceof SymbolValue) {
      return this.symbols.set(propertyKey, desc);
    }

    assert(false, 'Could not set property binding');
  }

  __InternalDeletePropertyBinding(propertyKey: PropertyKeyValue) {
    if (propertyKey instanceof StringValue) {
      return this.properties.delete(propertyKey);
    }

    if (propertyKey instanceof SymbolValue) {
      return this.symbols.delete(propertyKey);
    }

    assert(false, 'Could not delete property binding');
  }
}
