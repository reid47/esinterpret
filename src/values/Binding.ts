import { Value } from './Value';

export class Binding {
  name: string;
  mutable: boolean;
  initialized: boolean;
  deletable: boolean;
  strict: boolean;
  value: Value;

  constructor({
    name,
    mutable,
    initialized,
    deletable,
    strict
  }: {
    name: string;
    mutable: boolean;
    initialized: boolean;
    deletable: boolean;
    strict: boolean;
  }) {
    this.name = name;
    this.mutable = mutable;
    this.initialized = initialized;
    this.deletable = deletable;
    this.strict = strict;
  }

  initialize(value: Value) {
    this.value = value;
    this.initialized = true;
  }
}
