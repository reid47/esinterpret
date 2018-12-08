import { InterpreterOptions } from './types';

export function mergeOptions(givenOptions: any): InterpreterOptions {
  givenOptions = givenOptions || {};

  return {
    strictMode: !!givenOptions.strictMode
  };
}
