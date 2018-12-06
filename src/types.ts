export type PropertyKeyValue = StringValue | SymbolValue;

export type TypeHint = 'default' | 'string' | 'number';

export type ValueType =
  | 'Null'
  | 'String'
  | 'Symbol'
  | 'Boolean'
  | 'Number'
  | 'Object'
  | 'Function'
  | 'Proxy';

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
}

export interface ProxyValue extends JsValue {
  type: 'Proxy';
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
