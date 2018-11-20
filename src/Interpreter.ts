import * as JS from '@babel/types';
import { Realm } from './environment/Realm';
import { CreateRealm } from './abstract-operations/CreateRealm';
import { ExecutionContext } from './environment/ExecutionContext';
import { UndefinedValue } from './values/UndefinedValue';
import { ObjectCreate } from './abstract-operations/ObjectCreate';
import { assert } from './assert';
import { ObjectValue } from './values/ObjectValue';

export class Interpreter {
  executionContextStack: ExecutionContext[];

  constructor() {
    this.executionContextStack = [];
  }

  get runningExecutionContext() {
    return this.executionContextStack[this.executionContextStack.length - 1];
  }

  // ECMA-262 8.5
  initializeRealm() {
    const realm = CreateRealm();

    const newContext = new ExecutionContext();
    newContext.function = null;
    newContext.realm = realm;
    newContext.scriptOrModule = null;

    this.executionContextStack.push(newContext);

    const globalObj = ObjectCreate(realm, realm.__Intrinsics.__ObjectPrototype);
    const thisValue = globalObj;
    assert(globalObj instanceof ObjectValue, 'global should be an object');

    realm.__GlobalObject = globalObj;
    realm.__GlobalEnv = NewGlobalEnvironment(globalObj, thisValue);

    return realm;
  }
}

/*
  run() {
    this.onProgram(this.ast.program);
  }

  lastExpressionValue() {}

  private onBlockStatement(statement: JS.BlockStatement) {
    statement.body.forEach(innerStatement => {
      this.onStatement(innerStatement);
    });
  }

  private onBreakStatement(statement: JS.BreakStatement) {}

  private onClassDeclaration(statement: JS.ClassDeclaration) {}

  private onContinueStatement(statement: JS.ContinueStatement) {}

  private onDebuggerStatement(statement: JS.DebuggerStatement) {}

  private onDoWhileStatement(statement: JS.DoWhileStatement) {}

  private onEmptyStatement(statement: JS.EmptyStatement) {}

  private onExpressionStatement(statement: JS.ExpressionStatement) {}

  private onForInStatement(statement: JS.ForInStatement) {}

  private onForOfStatement(statement: JS.ForOfStatement) {}

  private onForStatement(statement: JS.ForStatement) {}

  private onFunctionDeclaration(statement: JS.FunctionDeclaration) {}

  private onIfStatement(statement: JS.IfStatement) {}

  private onLabeledStatement(statement: JS.LabeledStatement) {}

  private onProgram(program: JS.Program) {
    program.body.forEach(statement => {
      this.onStatement(statement);
    });
  }

  private onReturnStatement(statement: JS.ReturnStatement) {}

  private onStatement(statement: JS.Statement) {
    switch (statement.type) {
      case 'BlockStatement':
        this.onBlockStatement(statement);
        return;

      case 'BreakStatement':
        this.onBreakStatement(statement);
        return;

      case 'ClassDeclaration':
        this.onClassDeclaration(statement);
        return;

      case 'ContinueStatement':
        this.onContinueStatement(statement);
        return;

      case 'DebuggerStatement':
        this.onDebuggerStatement(statement);
        return;

      case 'DoWhileStatement':
        this.onDoWhileStatement(statement);
        return;

      case 'EmptyStatement':
        this.onEmptyStatement(statement);
        return;

      case 'ExpressionStatement':
        this.onExpressionStatement(statement);
        return;

      case 'ForInStatement':
        this.onForInStatement(statement);
        return;

      case 'ForOfStatement':
        this.onForOfStatement(statement);
        return;

      case 'ForStatement':
        this.onForStatement(statement);
        return;

      case 'FunctionDeclaration':
        this.onFunctionDeclaration(statement);
        return;

      case 'IfStatement':
        this.onIfStatement(statement);
        return;

      case 'LabeledStatement':
        this.onLabeledStatement(statement);
        return;

      case 'ReturnStatement':
        this.onReturnStatement(statement);
        return;

      case 'SwitchStatement':
        this.onSwitchStatement(statement);
        return;

      case 'ThrowStatement':
        this.onThrowStatement(statement);
        return;

      case 'TryStatement':
        this.onTryStatement(statement);
        return;

      case 'VariableDeclaration':
        this.onVariableDeclaration(statement);
        return;

      case 'WhileStatement':
        this.onWhileStatement(statement);
        return;

      case 'WithStatement':
        this.onWithStatement(statement);
        return;

      default:
        throw new Error(`Unsupported statement type: ${statement.type}`);
    }
  }

  private onSwitchStatement(statement: JS.SwitchStatement) {}

  private onThrowStatement(statement: JS.ThrowStatement) {}

  private onTryStatement(statement: JS.TryStatement) {}

  private onVariableDeclaration(statement: JS.VariableDeclaration) {}

  private onWhileStatement(statement: JS.WhileStatement) {}

  private onWithStatement(statement: JS.WithStatement) {}
}
*/
