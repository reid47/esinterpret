import { Completion } from './Completion';
import { Value } from '../values/Value';

export class AbruptCompletion extends Completion {
  __Type: 'break' | 'continue' | 'return' | 'throw';
  __Value: Value;
  __Target: string;
}
