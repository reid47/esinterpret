import { NumberValue } from '../../values/NumberValue';
import { StringValue } from '../../values/StringValue';
import { Realm } from '../../environment/Realm';

// ECMA-262 7.1.12.1
export function NumberToString(realm: Realm, number: NumberValue): StringValue {
  // Note: here, we take advantage of the fact that this
  // implementation is written in JavaScript. The spec spells
  // out a full algorithm for doing the conversion, but we will
  // let the running JS engine do it for us.
  return new StringValue(realm, '' + number.value);
}
