import { ObjectValue } from './ObjectValue';
import { PropertyKeyValue } from '../types';
import { PropertyDescriptor } from './PropertyDescriptor';
import { FunctionValue } from './FunctionValue';

export class BoundFunctionExotic extends FunctionValue {
  __BoundTargetFunction: any; // TODO?
}
