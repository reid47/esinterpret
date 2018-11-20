import { Realm } from './Realm';
import { LexicalEnvironment } from './LexicalEnvironment';
import { ScriptRecord } from './ScriptRecord';

// ECMA-262 8.3
export class ExecutionContext {
  function: any = null;
  realm: Realm = null;
  scriptOrModule: ScriptRecord = null;
  lexicalEnvironment: LexicalEnvironment;
  variableEnvironment: LexicalEnvironment;

  constructor() {}
}
