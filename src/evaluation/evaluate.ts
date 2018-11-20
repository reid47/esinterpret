import * as Nodes from '@babel/types';
import { evaluateNumberLiteral } from './evaluateNumberLiteral';
import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import { evaluateBooleanLiteral } from './evaluateBooleanLiteral';
import { evaluateStringLiteral } from './evaluateStringLiteral';
import { evaluateNullLiteral } from './evaluateNullLiteral';
import { evaluateFile } from './evaluateFile';
import { evaluateProgram } from './evaluateProgram';
import { evaluateExpressionStatement } from './evaluateExpressionStatement';

export function evaluate(realm: Realm, node: Nodes.Node, env: LexicalEnvironment) {
  switch (node.type) {
    case 'BooleanLiteral':
      return evaluateBooleanLiteral(realm, node, env);
    case 'ExpressionStatement':
      return evaluateExpressionStatement(realm, node, env);
    case 'File':
      return evaluateFile(realm, node, env);
    case 'NumericLiteral':
      return evaluateNumberLiteral(realm, node, env);
    case 'NullLiteral':
      return evaluateNullLiteral(realm, node, env);
    case 'Program':
      return evaluateProgram(realm, node, env);
    case 'StringLiteral':
      return evaluateStringLiteral(realm, node, env);
    default:
      throw new Error(`Not yet implemented: ${node.type}`);
  }
}
