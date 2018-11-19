import { PropertyDescriptor } from '../values/PropertyDescriptor';

// ECMA-262 6.2.5.2
export function IsDataDescriptor(desc: PropertyDescriptor) {
  if (!desc) return false;
  if (!desc.hasOwnProperty('__Value') && !desc.hasOwnProperty('__Writable')) return false;
  return true;
}
