import { Value } from '../values/Value';

export abstract class Completion {
  __Type: 'normal' | 'break' | 'continue' | 'return' | 'throw';
  __Value: Value;
  __Target: string;
}
