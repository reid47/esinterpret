import { Value } from '../../values/Value';
import { UndefinedValue } from '../../values/UndefinedValue';
import { ToInteger } from './ToInteger';
import { Realm } from '../../environment/Realm';
import { ToLength } from './ToLength';
import { NumberValue } from '../../values/NumberValue';
import { SameValueZero } from '../comparison/SameValueZero';

export function ToIndex(realm: Realm, value: Value) {
  let index;

  if (value instanceof UndefinedValue) {
    index = new NumberValue(realm, 0);
  } else {
    const integerIndex = ToInteger(realm, value);

    if (integerIndex.value < 0) {
      throw new RangeError('Index out of range');
    }

    index = ToLength(realm, integerIndex);

    if (!SameValueZero(integerIndex, index)) {
      throw new RangeError('Index out of range');
    }
  }

  return index;
}
