import { PropertyDescriptor } from '../values/PropertyDescriptor';
import { IsAccessorDescriptor } from './IsAccessorDescriptor';
import { IsDataDescriptor } from './IsDataDescriptor';

// ECMA-262 6.2.5.3
export function IsGenericDescriptor(desc: PropertyDescriptor) {
  if (!desc) return false;
  if (!IsAccessorDescriptor(desc) && !IsDataDescriptor(desc)) return true;
  return false;
}
