import { Value } from '../../values/Value';
import { ToNumber } from './ToNumber';
import { Realm } from '../../environment/Realm';

// ECMA-262 7.1.11
export function ToUint8Clamp(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number <= 0) return +0;
  if (number >= 255) return 255;

  const f = Math.floor(number);

  if (f + 0.5 < number) return f + 1;

  if (number < f + 0.5) return f;

  if (number % 2 !== 0) return f + 1;

  return f;
}
