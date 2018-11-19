import { NumberValue } from '../../values/NumberValue';
import { Value } from '../../values/Value';

// ECMA-262 7.2.6
export function IsInteger(value: Value) {
  if (!(value instanceof NumberValue)) return false;

  const number = value.value;
  if (!isFinite(number)) return false;
  if (Math.floor(Math.abs(number)) !== Math.abs(number)) return false;

  return true;
}
