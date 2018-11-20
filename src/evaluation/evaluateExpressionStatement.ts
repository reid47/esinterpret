import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import * as Nodes from '@babel/types';
import { evaluate } from './evaluate';

// ECMA-262 13.5.1
export function evaluateExpressionStatement(
  realm: Realm,
  node: Nodes.ExpressionStatement,
  env: LexicalEnvironment
) {
  return evaluate(realm, node.expression, env);
}
