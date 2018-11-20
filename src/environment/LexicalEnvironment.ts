import { Realm } from './Realm';
import { EnvironmentRecord } from './EnvironmentRecord';
import * as Nodes from '@babel/types';

export class LexicalEnvironment {
  __Realm: Realm;
  environmentRecord: EnvironmentRecord;
  parent: LexicalEnvironment | null;

  constructor(realm: Realm) {
    this.__Realm = realm;
    this.parent = null;
  }

  evaluate(node: Nodes.Node) {}
}
