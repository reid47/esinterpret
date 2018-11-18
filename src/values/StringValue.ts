import { Value } from './Value';
import { Realm } from '../environment/Realm';

export class StringValue extends Value {
  value: string;

  constructor(realm: Realm, value: string) {
    super(realm);
    this.value = value;
  }
}
