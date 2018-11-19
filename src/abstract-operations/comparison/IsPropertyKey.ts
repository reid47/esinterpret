import { StringValue } from '../../values/StringValue';
import { SymbolValue } from '../../values/SymbolValue';

// ECMA-262 7.2.7
export function IsPropertyKey(arg: any) {
  return typeof arg === 'string' || arg instanceof StringValue || arg instanceof SymbolValue;
}
