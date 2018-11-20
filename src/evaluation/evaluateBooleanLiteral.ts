import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import * as Nodes from '@babel/types';
import { BooleanValue } from '../values/BooleanValue';

// ECMA-262 12.2.4.1
export function evaluateBooleanLiteral(
  realm: Realm,
  node: Nodes.BooleanLiteral,
  env: LexicalEnvironment
) {
  return new BooleanValue(realm, node.value);
}
