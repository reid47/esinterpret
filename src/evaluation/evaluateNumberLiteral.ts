import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import * as Nodes from '@babel/types';
import { NumberValue } from '../values/NumberValue';

// ECMA-262 12.2.4.1
export function evaluateNumberLiteral(
  realm: Realm,
  node: Nodes.NumberLiteral,
  env: LexicalEnvironment
) {
  return new NumberValue(realm, node.value);
}
