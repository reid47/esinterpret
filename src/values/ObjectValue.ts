import { Value } from './Value';
import { NullValue } from './NullValue';
import { BooleanValue } from './BooleanValue';
import { OrdinaryGetPrototypeOf } from '../abstract-operations/OrdinaryGetPrototypeOf';
import { OrdinarySetPrototypeOf } from '../abstract-operations/OrdinarySetPrototypeOf';
import { OrdinaryIsExtensible } from '../abstract-operations/OrdinaryIsExtensible';
import { Realm } from '../environment/Realm';
import { OrdinaryPreventExtensions } from '../abstract-operations/OrdinaryPreventExtensions';
import { OrdinaryGetOwnProperty } from '../abstract-operations/OrdinaryGetOwnProperty';
import { StringValue } from './StringValue';
import { SymbolValue } from './SymbolValue';
import { PropertyKeyValue } from '../types';
import { assert } from '../assert';

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
  __GetOwnProperty(propertyKey: StringValue | SymbolValue) {
    return OrdinaryGetOwnProperty(this, propertyKey);
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
}
