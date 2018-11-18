import { Value } from '../values/Value';
import { NumberValue } from '../values/NumberValue';
import { assert } from '../assert';
import { UndefinedValue } from '../values/UndefinedValue';
import { NullValue } from '../values/NullValue';
import { StringValue } from '../values/StringValue';
import { BooleanValue } from '../values/BooleanValue';
import { SymbolValue } from '../values/SymbolValue';

// ECMA-262 7.2.12
export function SameValueNonNumber(x: Value, y: Value) {
  assert(!(x instanceof NumberValue), 'Should not be a number');
  assert(x.getType() === y.getType(), 'Should be the same types');

  if (x instanceof UndefinedValue) return true;

  if (x instanceof NullValue) return true;

  if (x instanceof StringValue && y instanceof StringValue) {
    return x.value === y.value;
  }

  if (x instanceof BooleanValue && y instanceof BooleanValue) {
    return x.value === y.value;
  }

  if (x instanceof SymbolValue && y instanceof SymbolValue) {
    return x === y;
  }

  return x === y;
}
