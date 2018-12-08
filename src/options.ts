import { InterpreterOptions } from './types';

export function mergeOptions(givenOptions: any): InterpreterOptions {
  givenOptions = givenOptions || {};

  return {
    strictMode: !!givenOptions.strictMode,
    maxCallStackDepth: parseInt(givenOptions.maxCallStackDepth, 10) || Infinity,
    maxLoopIterations: parseInt(givenOptions.maxLoopIterations, 10) || Infinity
  };
}
