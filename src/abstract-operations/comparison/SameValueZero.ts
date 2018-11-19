import { Value } from '../../values/Value';
import { NumberValue } from '../../values/NumberValue';
import { SameValueNonNumber } from './SameValueNonNumber';

// ECMA-262 7.2.11
export function SameValueZero(x: Value, y: Value) {
  if (x.getType() !== y.getType()) return false;

  if (x instanceof NumberValue && y instanceof NumberValue) {
    if (isNaN(x.value) && isNaN(y.value)) return true;
    if (Object.is(x.value, +0) && Object.is(y.value, -0)) return true;
    if (Object.is(x.value, -0) && Object.is(y.value, +0)) return true;
    if (x.value === y.value) return true;
    return false;
  }

  return SameValueNonNumber(x, y);
}
