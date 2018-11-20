import { Realm } from './Realm';
import { EnvironmentRecord } from './EnvironmentRecord';

export class LexicalEnvironment {
  __Realm: Realm;
  environmentRecord: EnvironmentRecord;
  parent: LexicalEnvironment | null;

  constructor(realm: Realm) {
    this.__Realm = realm;
    this.parent = null;
  }
}
