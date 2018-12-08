import { parse } from '@babel/parser';
import { assert } from './assert';
import * as ops from './operations';
import { Evaluation } from './evaluation';
import {
  Realm,
  PendingJob,
  ExecutionContext,
  ScriptRecord,
  JsValue,
  InterpreterOptions
} from './types';
import { isObjectValue } from './values';
import { mergeOptions } from './options';

export class Interpreter {
  options: InterpreterOptions;
  realm: Realm;
  executionContextStack: ExecutionContext[];
  scriptJobQueue: PendingJob[];
  promiseJobQueue: PendingJob[];

  constructor(options?: InterpreterOptions) {
    this.options = mergeOptions(options);
    this.executionContextStack = [];
    this.scriptJobQueue = [];
    this.promiseJobQueue = [];
    this.realm = this.initializeRealm();
  }

  get runningExecutionContext() {
    return this.executionContextStack[this.executionContextStack.length - 1];
  }

  // ECMA-262 15.1.9
  parseScript(source: string, realm: Realm): ScriptRecord {
    // TODO: handle parse errors per spec
    const ast = parse(source);
    return { realm, environment: null, source, ast };
  }

  // ECMA-262 15.1.12
  evaluateScript(source: string): JsValue {
    // TODO: handle parse errors per spec
    const scriptRecord = this.parseScript(source, this.realm);

    const { realm, ast } = scriptRecord;

    const scriptContext: ExecutionContext = {
      function: null,
      realm,
      scriptOrModule: scriptRecord,
      variableEnvironment: realm.globalEnv,
      lexicalEnvironment: realm.globalEnv
    };

    // TODO: Suspend the currently running execution context?

    this.executionContextStack.push(scriptContext);

    // GlobalDeclarationInstantiation(scriptBody, globalEnv);

    const result = new Evaluation().evaluate(this.realm, ast, realm.globalEnv);

    this.executionContextStack.pop();

    assert(
      this.executionContextStack.length > 0,
      'execution context stack should not be empty'
    );

    return result;
  }

  // ECMA-262 8.5
  initializeRealm() {
    const realm = ops.createRealm();

    const newContext: ExecutionContext = {
      function: null,
      realm,
      scriptOrModule: null,
      lexicalEnvironment: null,
      variableEnvironment: null
    };

    this.executionContextStack.push(newContext);

    const globalObj = ops.objectCreate(realm, realm.intrinsics.objectPrototype);
    const thisValue = globalObj;

    assert(isObjectValue(globalObj), 'global should be an object');

    // ECMA-262 8.2.3
    realm.globalObject = globalObj;
    // realm.globalEnv = NewGlobalEnvironment(realm, globalObj, thisValue);

    // ECMA-262 8.2.4
    // TODO: SetDefaultGlobalBindings

    return realm;
  }
}
