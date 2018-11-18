import { PropertyDescriptor } from '../values/PropertyDescriptor';

// ECMA-262 6.2.5.1
export function IsAccessorDescriptor(desc: PropertyDescriptor) {
  if (!desc) return false;
  if (!desc.__Get && !desc.__Set) return false;
  return true;
}
