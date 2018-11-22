import * as Nodes from '@babel/types';
import {
  Realm,
  LexicalEnvironment,
  BooleanValue,
  NullValue,
  NumberValue,
  StringValue
} from './operations';

// ECMA-262 12.2.4.1
function evaluateBooleanLiteral(realm: Realm, node: Nodes.BooleanLiteral, env: LexicalEnvironment) {
  return new BooleanValue(realm, node.value);
}

function evaluateBinaryExpression(
  realm: Realm,
  node: Nodes.BinaryExpression,
  env: LexicalEnvironment
) {
  if (node.operator === '+') {
    // ECMA-262 12.8.3.1
  }

  throw new Error('Binary operator not implemented: ' + node.operator);
}

// ECMA-262 13.5.1
function evaluateExpressionStatement(
  realm: Realm,
  node: Nodes.ExpressionStatement,
  env: LexicalEnvironment
) {
  return evaluate(realm, node.expression, env);
}

function evaluateFile(realm: Realm, node: Nodes.File, env: LexicalEnvironment) {
  return evaluate(realm, node.program, env);
}

function evaluateNullLiteral(realm: Realm, node: Nodes.NullLiteral, env: LexicalEnvironment) {
  return new NullValue(realm);
}

// ECMA-262 12.2.4.1
function evaluateNumberLiteral(realm: Realm, node: Nodes.NumberLiteral, env: LexicalEnvironment) {
  return new NumberValue(realm, node.value);
}

function evaluateProgram(realm: Realm, node: Nodes.Program, env: LexicalEnvironment) {
  let last;

  node.body.forEach(bodyNode => {
    last = evaluate(realm, bodyNode, env);
  });

  return last;
}

// ECMA-262 12.2.4.1
function evaluateStringLiteral(realm: Realm, node: Nodes.StringLiteral, env: LexicalEnvironment) {
  return new StringValue(realm, node.value);
}

export function evaluate(realm: Realm, node: Nodes.Node, env: LexicalEnvironment) {
  switch (node.type) {
    case 'BinaryExpression':
      return evaluateBinaryExpression(realm, node, env);
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
