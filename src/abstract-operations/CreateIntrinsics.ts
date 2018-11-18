import { Realm } from '../environment/Realm';
import { ObjectCreate } from './ObjectCreate';
import { NullValue } from '../values/NullValue';

// ECMA-262 8.2.2
export function CreateIntrinsics(realm: Realm) {
  const intrinsics: any = {};
  realm.__Intrinsics = intrinsics;

  const objProto = ObjectCreate(realm, new NullValue(realm));

  intrinsics.__ObjectPrototype = objProto;
}
