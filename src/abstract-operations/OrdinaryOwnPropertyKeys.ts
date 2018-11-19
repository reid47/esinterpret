import { ObjectValue } from '../values/ObjectValue';

// ECMA-262 9.1.11.1
export function OrdinaryOwnPropertyKeys(obj: ObjectValue) {
  const keys = [];

  // obj.properties.forEach((value, key) => {
  //   const stringKey = typeof key === 'string' ? key : key.value;

  // });

  for (const symbolKey of obj.symbols.keys()) {
    keys.push(symbolKey);
  }

  return keys;
}
