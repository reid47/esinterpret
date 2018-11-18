import { Realm } from '../environment/Realm';

export abstract class Value {
  __Realm: Realm;

  constructor(realm: Realm) {
    this.__Realm = realm;
  }

  getType() {
    return this.constructor;
  }
}
