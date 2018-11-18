import { Value } from './Value';
import { Realm } from '../Realm';

export class NumberValue extends Value {
  value: number;

  constructor(realm: Realm, value: number) {
    super(realm);
    this.value = value;
  }
}
