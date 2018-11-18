import { Value } from './Value';
import { Realm } from '../environment/Realm';

export class NumberValue extends Value {
  value: number;

  constructor(realm: Realm, value: number) {
    super(realm);
    this.value = value;
  }
}
