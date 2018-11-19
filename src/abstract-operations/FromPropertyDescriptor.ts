import { PropertyDescriptor } from '../values/PropertyDescriptor';
import { ObjectCreate } from './ObjectCreate';
import { Realm } from '../environment/Realm';
import { assert } from '../assert';
import { CreateDataProperty } from './objects/CreateDataProperty';
import { StringValue } from '../values/StringValue';

// ECMA-262 6.2.5.4
export function FromPropertyDescriptor(realm: Realm, desc: PropertyDescriptor) {
  if (!desc) return undefined; // TODO: or UndefinedValue?

  const obj = ObjectCreate(realm, realm.__Intrinsics.__ObjectPrototype);

  assert(obj.__Extensible, 'Object should be extensible');
  assert(
    obj.properties.size === 0 && obj.symbols.size === 0,
    'Object should not have any properties or symbols'
  );

  if (desc.__Value) {
    const created = CreateDataProperty(realm, obj, new StringValue(realm, 'value'), desc.__Value);

    assert(created, 'Could not create value property');
  }

  if (desc.__Writable) {
    const created = CreateDataProperty(
      realm,
      obj,
      new StringValue(realm, 'writable'),
      desc.__Writable
    );

    assert(created, 'Could not create writable property');
  }

  if (desc.__Get) {
    const created = CreateDataProperty(realm, obj, new StringValue(realm, 'get'), desc.__Get);

    assert(created, 'Could not create get property');
  }

  if (desc.__Set) {
    const created = CreateDataProperty(realm, obj, new StringValue(realm, 'set'), desc.__Set);

    assert(created, 'Could not create set property');
  }

  if (desc.__Enumerable) {
    const created = CreateDataProperty(
      realm,
      obj,
      new StringValue(realm, 'enumerable'),
      desc.__Enumerable
    );

    assert(created, 'Could not create enumerable property');
  }

  if (desc.__Configurable) {
    const created = CreateDataProperty(
      realm,
      obj,
      new StringValue(realm, 'configurable'),
      desc.__Configurable
    );

    assert(created, 'Could not create configurable property');
  }

  return obj;
}
