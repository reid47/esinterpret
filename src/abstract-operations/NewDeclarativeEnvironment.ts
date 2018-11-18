import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import { DeclarativeEnvironmentRecord } from '../environment/DeclarativeEnvironmentRecord';
import { Realm } from '../environment/Realm';

// ECMA-262 8.1.2.2
export function NewDeclarativeEnvironment(realm: Realm, parentEnv: LexicalEnvironment) {
  const env = new LexicalEnvironment(realm);
  const envRec = new DeclarativeEnvironmentRecord(realm);
  env.environmentRecord = envRec;
  env.parent = parentEnv;
  return env;
}
