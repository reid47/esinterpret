import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import * as Nodes from '@babel/types';
import { evaluate } from './evaluate';

export function evaluateProgram(realm: Realm, node: Nodes.Program, env: LexicalEnvironment) {
  let last;

  node.body.forEach(bodyNode => {
    last = evaluate(realm, bodyNode, env);
  });

  return last;
}
