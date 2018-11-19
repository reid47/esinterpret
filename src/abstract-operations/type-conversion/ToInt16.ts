import { Value } from '../../values/Value';
import { ToNumber } from './ToNumber';
import { Realm } from '../../environment/Realm';

// ECMA-262 7.1.7
export function ToInt16(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number === 0 || !isFinite(number)) return +0;

  const int = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));

  const int16bit = int % Math.pow(2, 16);

  return int16bit >= Math.pow(2, 15) ? int16bit - Math.pow(2, 16) : int16bit;
}
