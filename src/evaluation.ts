import * as Nodes from '@babel/types';
import { Realm, LexicalEnvironment, JsValue } from './types';
import * as ops from './operations';
import * as values from './values';
import { assert } from './assert';
import { NotImplementedError } from './errors';

export class Evaluation {
  currentLocation: { start: number; end: number } = {
    start: 0,
    end: 0
  };

  evaluateBinaryExpression(
    realm: Realm,
    node: Nodes.BinaryExpression,
    env: LexicalEnvironment
  ) {
    const lVal = ops.getValue(this.evaluate(realm, node.left, env));
    const rVal = ops.getValue(this.evaluate(realm, node.right, env));

    switch (node.operator) {
      case '**': {
        const result = Math.pow(ops.toNumber(lVal), ops.toNumber(rVal));
        return values.createNumberValue(realm, result);
      }

      case '*': {
        const result = ops.toNumber(lVal) * ops.toNumber(rVal);
        return values.createNumberValue(realm, result);
      }

      case '/': {
        const result = ops.toNumber(lVal) / ops.toNumber(rVal);
        return values.createNumberValue(realm, result);
      }

      case '%': {
        const result = ops.toNumber(lVal) % ops.toNumber(rVal);
        return values.createNumberValue(realm, result);
      }

      case '+': {
        const result = ops.toNumber(lVal) + ops.toNumber(rVal);
        return values.createNumberValue(realm, result);
      }

      case '-': {
        const result = ops.toNumber(lVal) - ops.toNumber(rVal);
        return values.createNumberValue(realm, result);
      }

      case '<<': {
        const result = ops.toInt32(lVal) << (ops.toUint32(rVal) & 0x1f);
        return values.createNumberValue(realm, result);
      }

      case '>>': {
        const result = ops.toInt32(lVal) >> (ops.toUint32(rVal) & 0x1f);
        return values.createNumberValue(realm, result);
      }

      case '>>>': {
        const result = ops.toUint32(lVal) >>> (ops.toUint32(rVal) & 0x1f);
        return values.createNumberValue(realm, result);
      }

      case '<': {
        const result = ops.abstractRelationalComparison(lVal, rVal, true);
        return values.createBooleanValue(
          realm,
          result === void 0 ? false : result
        );
      }

      case '>': {
        const result = ops.abstractRelationalComparison(rVal, lVal, false);
        return values.createBooleanValue(
          realm,
          result === void 0 ? false : result
        );
      }

      case '<=': {
        const result = ops.abstractRelationalComparison(rVal, lVal, false);
        return values.createBooleanValue(
          realm,
          result === false ? true : false
        );
      }

      case '>=': {
        const result = ops.abstractRelationalComparison(lVal, rVal, true);
        return values.createBooleanValue(
          realm,
          result !== false ? false : true
        );
      }

      case '==': {
        const result = ops.abstractEqualityComparison(rVal, lVal);
        return values.createBooleanValue(realm, result);
      }

      case '!=': {
        const result = ops.abstractEqualityComparison(rVal, lVal);
        return values.createBooleanValue(realm, !result);
      }

      case '===': {
        const result = ops.strictEqualityComparison(rVal, lVal);
        return values.createBooleanValue(realm, result);
      }

      case '!==': {
        const result = ops.strictEqualityComparison(rVal, lVal);
        return values.createBooleanValue(realm, !result);
      }

      case '&': {
        const result = ops.toInt32(lVal) & ops.toInt32(rVal);
        return values.createNumberValue(realm, result);
      }

      case '^': {
        const result = ops.toInt32(lVal) ^ ops.toInt32(rVal);
        return values.createNumberValue(realm, result);
      }

      case '|': {
        const result = ops.toInt32(lVal) | ops.toInt32(rVal);
        return values.createNumberValue(realm, result);
      }
    }

    throw new NotImplementedError(`binary operator: ${node.operator}`);
  }

  // ECMA-262 12.2.4.1
  evaluateBooleanLiteral(
    realm: Realm,
    node: Nodes.BooleanLiteral,
    env: LexicalEnvironment
  ) {
    return values.createBooleanValue(realm, node.value);
  }

  // ECMA-262 12.14.3
  evaluateConditionalExpression(
    realm: Realm,
    node: Nodes.ConditionalExpression,
    env: LexicalEnvironment
  ) {
    const lRef = this.evaluate(realm, node.test, env);
    const lVal = ops.toBoolean(ops.getValue(lRef));

    if (lVal) {
      const trueRef = this.evaluate(realm, node.consequent, env);
      return ops.getValue(trueRef);
    }

    const falseRef = this.evaluate(realm, node.alternate, env);
    return ops.getValue(falseRef);
  }

  // ECMA-262 13.5.1
  evaluateExpressionStatement(
    realm: Realm,
    node: Nodes.ExpressionStatement,
    env: LexicalEnvironment
  ) {
    return this.evaluate(realm, node.expression, env);
  }

  evaluateFile(realm: Realm, node: Nodes.File, env: LexicalEnvironment) {
    return this.evaluate(realm, node.program, env);
  }

  evaluateLogicalExpression(
    realm: Realm,
    node: Nodes.LogicalExpression,
    env: LexicalEnvironment
  ) {
    switch (node.operator) {
      case '&&': {
        const lVal = ops.getValue(this.evaluate(realm, node.left, env));
        if (!ops.toBoolean(lVal))
          return values.createBooleanValue(realm, false);
        return ops.getValue(this.evaluate(realm, node.right, env));
      }

      case '||': {
        const lVal = ops.getValue(this.evaluate(realm, node.left, env));
        if (ops.toBoolean(lVal)) return lVal;
        return ops.getValue(this.evaluate(realm, node.right, env));
      }
    }

    throw new NotImplementedError(`logical operator: ${node.operator}`);
  }

  // ECMA-262 12.2.4.1
  evaluateNullLiteral(
    realm: Realm,
    node: Nodes.NullLiteral,
    env: LexicalEnvironment
  ) {
    return values.createNullValue(realm);
  }

  // ECMA-262 12.2.4.1
  evaluateNumberLiteral(
    realm: Realm,
    node: Nodes.NumberLiteral,
    env: LexicalEnvironment
  ) {
    return values.createNumberValue(realm, node.value);
  }

  evaluateProgram(realm: Realm, node: Nodes.Program, env: LexicalEnvironment) {
    let last;

    node.body.forEach(bodyNode => {
      last = this.evaluate(realm, bodyNode, env);
    });

    return last;
  }

  evaluateSequenceExpression(
    realm: Realm,
    node: Nodes.SequenceExpression,
    env: LexicalEnvironment
  ) {
    let last: JsValue;

    for (const exprNode of node.expressions) {
      last = ops.getValue(this.evaluate(realm, exprNode, env));
    }

    return last;
  }

  // ECMA-262 12.2.4.1
  evaluateStringLiteral(
    realm: Realm,
    node: Nodes.StringLiteral,
    env: LexicalEnvironment
  ) {
    return values.createStringValue(realm, node.value);
  }

  evaluateUnaryExpression(
    realm: Realm,
    node: Nodes.UnaryExpression,
    env: LexicalEnvironment
  ) {
    switch (node.operator) {
      case 'void': {
        ops.getValue(this.evaluate(realm, node.argument, env));
        return values.createUndefinedValue(realm);
      }

      case 'typeof': {
        // ECMA-262 12.5.5
        const expr = this.evaluate(realm, node.argument, env);

        if (values.isReference(expr)) {
          throw new NotImplementedError('typeof reference');
        }

        const val = ops.getValue(expr);

        switch (val.type) {
          case 'Undefined':
            return values.createStringValue(realm, 'undefined');
          case 'Null':
            return values.createStringValue(realm, 'object');
          case 'Boolean':
            return values.createStringValue(realm, 'boolean');
          case 'Number':
            return values.createStringValue(realm, 'number');
          case 'String':
            return values.createStringValue(realm, 'string');
          case 'Symbol':
            return values.createStringValue(realm, 'symbol');
          case 'Object': {
            if ('call' in val)
              return values.createStringValue(realm, 'function');
            return values.createStringValue(realm, 'object');
          }
          default:
            assert(false, `unexpected type: ${val.type}`);
        }
      }

      case '+': {
        // ECMA-262 12.5.6
        const expr = this.evaluate(realm, node.argument, env);
        return values.createNumberValue(
          realm,
          ops.toNumber(ops.getValue(expr))
        );
      }

      case '-': {
        // ECMA-262 12.5.7
        const expr = this.evaluate(realm, node.argument, env);
        const oldValue = ops.toNumber(ops.getValue(expr));
        if (isNaN(oldValue)) return values.createNumberValue(realm, NaN);
        return values.createNumberValue(realm, -oldValue);
      }

      case '~': {
        // ECMA-262 12.5.8
        const expr = this.evaluate(realm, node.argument, env);
        const oldValue = ops.toNumber(ops.getValue(expr));
        return values.createNumberValue(realm, ~oldValue);
      }

      case '!': {
        // ECMA-262 12.5.9
        const expr = this.evaluate(realm, node.argument, env);
        const oldValue = ops.toBoolean(ops.getValue(expr));
        return values.createBooleanValue(realm, !oldValue);
      }
    }

    throw new NotImplementedError(`unary operator: ${node.operator}`);
  }

  evaluate(realm: Realm, node: Nodes.Node, env: LexicalEnvironment): JsValue {
    this.currentLocation = {
      start: node.start,
      end: node.end
    };

    switch (node.type) {
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(realm, node, env);

      case 'BooleanLiteral':
        return this.evaluateBooleanLiteral(realm, node, env);

      case 'ConditionalExpression':
        return this.evaluateConditionalExpression(realm, node, env);

      case 'ExpressionStatement':
        return this.evaluateExpressionStatement(realm, node, env);

      case 'File':
        return this.evaluateFile(realm, node, env);

      case 'LogicalExpression':
        return this.evaluateLogicalExpression(realm, node, env);

      case 'NumericLiteral':
        return this.evaluateNumberLiteral(realm, node, env);

      case 'NullLiteral':
        return this.evaluateNullLiteral(realm, node, env);

      case 'Program':
        return this.evaluateProgram(realm, node, env);

      case 'SequenceExpression':
        return this.evaluateSequenceExpression(realm, node, env);

      case 'StringLiteral':
        return this.evaluateStringLiteral(realm, node, env);

      case 'UnaryExpression':
        return this.evaluateUnaryExpression(realm, node, env);

      default:
        throw new Error(`Not yet implemented: ${node.type}`);
    }
  }
}
