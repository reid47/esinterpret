import { Realm } from './Realm';
import { LexicalEnvironment } from './LexicalEnvironment';
import * as Nodes from '@babel/types';

// ECMA-262 15.1.8
export class ScriptRecord {
  __Realm?: Realm;
  __Environment?: LexicalEnvironment;
  __ECMAScriptCode: Nodes.File;
  __Source: string;

  constructor(realm: Realm, ast: Nodes.File, source: string) {
    this.__Realm = realm;
    this.__ECMAScriptCode = ast;
    this.__Environment = undefined;
    this.__Source = source;
  }
}
