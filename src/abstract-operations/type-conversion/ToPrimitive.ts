import { Value } from '../../values/Value';
import { assert } from '../../assert';
import { TypeHint } from '../../types';
import { ObjectValue } from '../../values/ObjectValue';
import { Realm } from '../../environment/Realm';
import { Call } from '../objects/Call';
import { OrdinaryToPrimitive } from './OrdinaryToPrimitive';
import { GetMethod } from '../objects/GetMethod';

// ECMA262 7.1.1
export function ToPrimitive(realm: Realm, input: Value, hint: TypeHint = 'default') {
  assert(input instanceof Value, 'Should be a valid value');

  if (input instanceof ObjectValue) {
    const exoticToPrim = GetMethod(realm, input, realm.__Intrinsics.__Symbol_toPrimitive);

    if (exoticToPrim) {
      const result = Call(realm, exoticToPrim, input, [hint]);
      if (!(result instanceof ObjectValue)) return result;
      throw new TypeError('Could not convert to primitive');
    }

    if (hint === 'default') hint = 'number';

    return OrdinaryToPrimitive(realm, input, hint);
  }

  return input;
}
