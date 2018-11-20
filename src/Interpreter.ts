import { parse } from '@babel/parser';
import { Realm } from './environment/Realm';
import { ExecutionContext } from './environment/ExecutionContext';
import { assert } from './assert';
import { ObjectValue } from './values/ObjectValue';
import { PendingJob } from './environment/PendingJob';
import { ScriptRecord } from './environment/ScriptRecord';
import { evaluate } from './evaluate';
import * as Ops from './operations';

export class Interpreter {
  realm: Realm;
  executionContextStack: ExecutionContext[];
  scriptJobQueue: PendingJob[];
  promiseJobQueue: PendingJob[];

  constructor() {
    this.realm = this.initializeRealm();
    this.executionContextStack = [];
    this.scriptJobQueue = [];
    this.promiseJobQueue = [];
  }

  get runningExecutionContext() {
    return this.executionContextStack[this.executionContextStack.length - 1];
  }

  // ECMA-262 15.1.9
  parseScript(source: string, realm: Realm): ScriptRecord {
    // TODO: handle parse errors per spec
    const body = parse(source);
    return new ScriptRecord(realm, body, source);
  }

  // ECMA 15.1.12
  evaluateScript(source: string) {
    // TODO: handle parse errors per spec
    const scriptRecord = this.parseScript(source, this.realm);

    const globalEnv = scriptRecord.__Realm.__GlobalEnv;

    const scriptContext = new ExecutionContext();
    scriptContext.function = null;
    scriptContext.realm = scriptRecord.__Realm;
    scriptContext.scriptOrModule = scriptRecord;
    scriptContext.variableEnvironment = globalEnv;
    scriptContext.lexicalEnvironment = globalEnv;

    // TODO: Suspend the currently running execution context?

    this.executionContextStack.push(scriptContext);

    const scriptBody = scriptRecord.__ECMAScriptCode;

    Ops.GlobalDeclarationInstantiation(scriptBody, globalEnv);

    const result = evaluate(this.realm, scriptBody, globalEnv);

    this.executionContextStack.pop();

    assert(this.executionContextStack.length > 0, 'execution context stack should not be empty');

    return result;
  }

  // ECMA-262 8.5
  initializeRealm() {
    const realm = Ops.CreateRealm();

    const newContext = new ExecutionContext();
    newContext.function = null;
    newContext.realm = realm;
    newContext.scriptOrModule = null;

    this.executionContextStack.push(newContext);

    const globalObj = Ops.ObjectCreate(realm, realm.__Intrinsics.__ObjectPrototype);
    const thisValue = globalObj;
    assert(globalObj instanceof ObjectValue, 'global should be an object');

    // ECMA-262 8.2.3
    realm.__GlobalObject = globalObj;
    realm.__GlobalEnv = Ops.NewGlobalEnvironment(realm, globalObj, thisValue);

    // ECMA-262 8.2.4
    // TODO: SetDefaultGlobalBindings

    return realm;
  }
}
