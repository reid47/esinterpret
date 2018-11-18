import { Value } from './Value';
import { Realm } from '../environment/Realm';

export class BooleanValue extends Value {
  value: boolean;
  
  constructor(realm: Realm, value: boolean) {
    super(realm);
    this.value = value;
  }
}
