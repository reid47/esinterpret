import { Value } from '../values/Value';
import { ObjectValue } from '../values/ObjectValue';
import { ArrayExotic } from '../values/ArrayExotic';
import { ProxyValue } from '../values/ProxyValue';

// ECMA-262 7.2.2
export function IsArray(value: Value) {
  if (!(value instanceof ObjectValue)) return false;

  if (value instanceof ArrayExotic) return true;

  if (value instanceof ProxyValue) {
    if (value.__ProxyHandler === null) {
      // TODO: NullValue above? abrupt completion below?
      throw new TypeError('No proxy handler');
    }

    return IsArray(value.__ProxyTarget);
  }

  // TODO more

  return false;
}
