import * as Nodes from '@babel/types';
import { Realm, LexicalEnvironment, JsValue } from './types';
import * as ops from './operations';
import {
  createNullValue,
  createBooleanValue,
  createNumberValue,
  createStringValue,
  isReference,
  createUndefinedValue
} from './values';
import { assert } from './assert';

// ECMA-262 12.2.4.1
function evaluateBooleanLiteral(
  realm: Realm,
  node: Nodes.BooleanLiteral,
  env: LexicalEnvironment
) {
  return createBooleanValue(realm, node.value);
}

// ECMA-262 12.14.3
function evaluateConditionalExpression(
  realm: Realm,
  node: Nodes.ConditionalExpression,
  env: LexicalEnvironment
) {
  const lRef = evaluate(realm, node.test, env);
  const lVal = ops.toBoolean(ops.getValue(lRef));

  if (lVal) {
    const trueRef = evaluate(realm, node.consequent, env);
    return ops.getValue(trueRef);
  }

  const falseRef = evaluate(realm, node.alternate, env);
  return ops.getValue(falseRef);
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

// ECMA-262 12.2.4.1
function evaluateNullLiteral(
  realm: Realm,
  node: Nodes.NullLiteral,
  env: LexicalEnvironment
) {
  return createNullValue(realm);
}

// ECMA-262 12.2.4.1
function evaluateNumberLiteral(
  realm: Realm,
  node: Nodes.NumberLiteral,
  env: LexicalEnvironment
) {
  return createNumberValue(realm, node.value);
}

function evaluateProgram(
  realm: Realm,
  node: Nodes.Program,
  env: LexicalEnvironment
) {
  let last;

  node.body.forEach(bodyNode => {
    last = evaluate(realm, bodyNode, env);
  });

  return last;
}

function evaluateSequenceExpression(
  realm: Realm,
  node: Nodes.SequenceExpression,
  env: LexicalEnvironment
) {
  let last: JsValue;

  for (const exprNode of node.expressions) {
    last = ops.getValue(evaluate(realm, exprNode, env));
  }

  return last;
}

// ECMA-262 12.2.4.1
function evaluateStringLiteral(
  realm: Realm,
  node: Nodes.StringLiteral,
  env: LexicalEnvironment
) {
  return createStringValue(realm, node.value);
}

function evaluateUnaryExpression(
  realm: Realm,
  node: Nodes.UnaryExpression,
  env: LexicalEnvironment
) {
  switch (node.operator) {
    // TODO: delete operator

    case 'void': {
      ops.getValue(evaluate(realm, node.argument, env));
      return createUndefinedValue(realm);
    }

    case 'typeof': {
      // ECMA-262 12.5.5
      const expr = evaluate(realm, node.argument, env);
      if (isReference(expr)) {
        // TODO
      }

      const val = ops.getValue(expr);

      switch (val.type) {
        case 'Undefined':
          return createStringValue(realm, 'undefined');
        case 'Null':
          return createStringValue(realm, 'object');
        case 'Boolean':
          return createStringValue(realm, 'boolean');
        case 'Number':
          return createStringValue(realm, 'number');
        case 'String':
          return createStringValue(realm, 'string');
        case 'Symbol':
          return createStringValue(realm, 'symbol');
        case 'Object': {
          if ('call' in val) return createStringValue(realm, 'function');
          return createStringValue(realm, 'object');
        }
        default:
          assert(false, `unexpected type: ${val.type}`);
      }
    }

    case '+': {
      // ECMA-262 12.5.6
      const expr = evaluate(realm, node.argument, env);
      return createNumberValue(realm, ops.toNumber(ops.getValue(expr)));
    }

    case '-': {
      // ECMA-262 12.5.7
      const expr = evaluate(realm, node.argument, env);
      const oldValue = ops.toNumber(ops.getValue(expr));
      if (isNaN(oldValue)) return createNumberValue(realm, NaN);
      return createNumberValue(realm, -oldValue);
    }

    case '~': {
      // ECMA-262 12.5.8
      const expr = evaluate(realm, node.argument, env);
      const oldValue = ops.toNumber(ops.getValue(expr));
      return createNumberValue(realm, ~oldValue);
    }

    case '!': {
      // ECMA-262 12.5.9
      const expr = evaluate(realm, node.argument, env);
      const oldValue = ops.toBoolean(ops.getValue(expr));
      return createBooleanValue(realm, !oldValue);
    }
  }
}

export function evaluate(
  realm: Realm,
  node: Nodes.Node,
  env: LexicalEnvironment
): JsValue {
  switch (node.type) {
    case 'BooleanLiteral':
      return evaluateBooleanLiteral(realm, node, env);
    case 'ConditionalExpression':
      return evaluateConditionalExpression(realm, node, env);
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
    case 'SequenceExpression':
      return evaluateSequenceExpression(realm, node, env);
    case 'StringLiteral':
      return evaluateStringLiteral(realm, node, env);
    case 'UnaryExpression':
      return evaluateUnaryExpression(realm, node, env);
    default:
      throw new Error(`Not yet implemented: ${node.type}`);
  }
}
