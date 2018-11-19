import { StringValue } from './values/StringValue';
import { SymbolValue } from './values/SymbolValue';
import { ObjectValue } from './values/ObjectValue';

export type PropertyKeyValue = StringValue | SymbolValue;
// export type PropertyKeyValue = string | StringValue | SymbolValue;

export type PropertyBinding = {
  descriptor?: PropertyDescriptor;
  object: ObjectValue;
  key: void | string | SymbolValue;
  internalSlot?: boolean;
};

export type TypeHint = 'default' | 'string' | 'number';
