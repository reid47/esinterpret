export class NotImplementedError extends Error {
  constructor(message) {
    super(`Not implemented: ${message}`);
  }
}

export class SpecAssertionError extends Error {}
