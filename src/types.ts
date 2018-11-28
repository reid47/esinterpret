import { StringValue, SymbolValue } from './operations';

export type PropertyKeyValue = StringValue | SymbolValue;

export type TypeHint = 'default' | 'string' | 'number';
