import { Realm } from '../environment/Realm';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import { DeclarativeEnvironmentRecord } from '../environment/DeclarativeEnvironmentRecord';

// ECMA-262 8.1.2.5
export function NewGlobalEnvironment(realm: Realm, globalObj, thisValue) {
  const env = new LexicalEnvironment(realm);
  const objRec = new ObjectEnvironmentRecord(globalObj);
  const declRec = new DeclarativeEnvironmentRecord(realm);
  const globalRec = new GlobalEnvironmentRecord(realm);

  globalRec.__ObjectRecord = objRec;
  globalRec.__GlobalThisValue = thisValue;
  globalRec.__DeclarativeRecord = declRec;
  globalRec.__VarNames = [];

  env.environmentRecord = globalRec;
  env.parent = null;

  return env;
}
