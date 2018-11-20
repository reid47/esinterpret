import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import * as Nodes from '@babel/types';
import { StringValue } from '../values/StringValue';

// ECMA-262 12.2.4.1
export function evaluateStringLiteral(
  realm: Realm,
  node: Nodes.StringLiteral,
  env: LexicalEnvironment
) {
  return new StringValue(realm, node.value);
}
