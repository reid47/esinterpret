import { Value } from './Value';
import { Realm } from '../environment/Realm';

export class SymbolValue extends Value {
  constructor(realm: Realm) {
    super(realm);
  }
}
