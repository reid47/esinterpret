import { Realm } from './Realm';
import { LexicalEnvironment } from './LexicalEnvironment';

// ECMA-262 8.3
export class ExecutionContext {
  function: any = null;
  realm: Realm = null;
  scriptOrModule: any = null;
  lexicalEnvironment: LexicalEnvironment;
  variableEnvironment: LexicalEnvironment;

  constructor() {}
}
