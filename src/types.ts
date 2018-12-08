export interface InterpreterOptions {
  strictMode: boolean;
  maxCallStackDepth: number;
  maxLoopIterations: number;
}

export type PropertyKeyValue = StringValue | SymbolValue;

export type TypeHint = 'default' | 'string' | 'number';

export type ValueType =
  | 'Undefined'
  | 'Null'
  | 'String'
  | 'Symbol'
  | 'Boolean'
  | 'Number'
  | 'Object';

export interface Realm {
  globalObject;
  globalEnv;
  templateMap;
  intrinsics;
}

export interface JsValue {
  realm: Realm;
  type: ValueType;
  value?: any;
}

export interface NullValue extends JsValue {
  type: 'Null';
  value: null;
}

export interface UndefinedValue extends JsValue {
  type: 'Undefined';
  value: undefined;
}

export interface BooleanValue extends JsValue {
  type: 'Boolean';
  value: boolean;
}

export interface NumberValue extends JsValue {
  type: 'Number';
  value: number;
}

export interface StringValue extends JsValue {
  type: 'String';
  value: string;
}

export interface SymbolValue extends JsValue {
  type: 'Symbol';
  value: symbol;
}

export interface ObjectValue extends JsValue {
  type: 'Object';
  prototype: ObjectValue | NullValue;
  extensible: BooleanValue;
  properties: Map<StringValue, any>;
  symbols: Map<SymbolValue, any>;
  booleanData?: boolean;
  numberData?: number;
  stringData?: string;
  symbolData?: symbol;
}

export interface ExecutionContext {
  function: any;
  realm: Realm;
  scriptOrModule: ScriptRecord;
  lexicalEnvironment: LexicalEnvironment;
  variableEnvironment: LexicalEnvironment;
}

export interface ScriptRecord {
  realm: Realm;
  environment: LexicalEnvironment;
  source: string;
  ast: any;
}

export interface LexicalEnvironment {
  realm: Realm;
  environmentRecord: any; //TODO EnvironmentRecord;
  parent: LexicalEnvironment | null;
}

export interface PendingJob {
  job: (...args: any[]) => any;
  arguments: ValueType[];
  realm: Realm;
  scriptOrModule: ScriptRecord;
}
