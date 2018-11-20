import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import * as Nodes from '@babel/types';
import { BooleanValue } from '../values/BooleanValue';
import { assert } from '../assert';
import { Value } from '../values/Value';

export function File(realm: Realm, node: Nodes.File, env: LexicalEnvironment) {
  const value = env.evaluate(node.program);
  assert(value instanceof Value, 'should evaluate to a value');
  return value;
}
