import { StringValue } from './values/StringValue';
import { SymbolValue } from './values/SymbolValue';
import { ObjectValue } from './values/ObjectValue';

export type PropertyKeyValue = StringValue | SymbolValue;

export type TypeHint = 'default' | 'string' | 'number';
