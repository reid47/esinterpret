import { AbruptCompletion } from './AbruptCompletion';
import { Value } from '../values/Value';

export class ThrowCompletion extends AbruptCompletion {
  constructor(argument: Value) {
    super();
    this.__Type = 'throw';
    this.__Value = argument;
    this.__Target = 'empty';
  }
}
