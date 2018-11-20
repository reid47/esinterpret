import { Value } from '../values/Value';
import { Realm } from './Realm';
import { ScriptRecord } from './ScriptRecord';

// ECMA-262 8.4
export class PendingJob {
  __Job: Function;
  __Arguments: Value[];
  __Realm: Realm;
  __ScriptOrModule: ScriptRecord;
}
