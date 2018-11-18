import { Completion } from './Completion';
import { Value } from '../values/Value';

export class NormalCompletion extends Completion {
  constructor(argument: Value) {
    super();
    this.__Type = 'normal';
    this.__Value = argument;
    this.__Target = 'empty';
  }
}
