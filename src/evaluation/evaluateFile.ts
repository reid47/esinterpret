import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import * as Nodes from '@babel/types';
import { evaluate } from './evaluate';

export function evaluateFile(realm: Realm, node: Nodes.File, env: LexicalEnvironment) {
  return evaluate(realm, node.program, env);
}
