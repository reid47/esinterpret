import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import * as Nodes from '@babel/types';
import { NullValue } from '../values/NullValue';

// ECMA-262 12.2.4.1
export function NullLiteral(realm: Realm, node: Nodes.NullLiteral, env: LexicalEnvironment) {
  return new NullValue(realm);
}
