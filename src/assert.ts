class SpecAssertionError extends Error {}

export function assert(condition, message) {
  if (!condition) {
    throw new SpecAssertionError(`Assertion failed: ${message}`);
  }
}
