import { ObjectValue } from '../../values/ObjectValue';
import { FunctionValue } from '../../values/FunctionValue';
import { assert } from '../../assert';
import { Get } from './Get';
import { Realm } from '../../environment/Realm';
import { IsConstructor } from '../comparison/IsConstructor';
import { StringValue } from '../../values/StringValue';

// ECMA-262 7.3.21
export default function SpeciesConstructor(
  realm: Realm,
  obj: ObjectValue,
  defaultConstructor: FunctionValue
) {
  assert(obj instanceof ObjectValue, 'should be an object');

  const ctor = Get(obj, new StringValue(realm, 'constructor'));

  if (!ctor) return defaultConstructor;

  const species = Get(ctor, realm.__Intrinsics.__Symbol_species);

  if (species === undefined || species === null) {
    return defaultConstructor;
  }

  if (IsConstructor(species)) return species;

  throw new TypeError('Could not get constructor');
}
