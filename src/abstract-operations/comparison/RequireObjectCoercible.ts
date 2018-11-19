import { Value } from '../../values/Value';
import { UndefinedValue } from '../../values/UndefinedValue';
import { NullValue } from '../../values/NullValue';

// ECMA-262 7.2.1
export function RequireObjectCoercible(value: Value) {
  if (value instanceof UndefinedValue || value instanceof NullValue) {
    // TODO: abrupt completion?
    throw new TypeError('Cannot coerce null or undefined into object');
  }

  return value;
}
