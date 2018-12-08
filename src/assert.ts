import { SpecAssertionError } from './errors';

export function assert(condition, message) {
  if (!condition) {
    throw new SpecAssertionError(`Assertion failed: ${message}`);
  }
}
