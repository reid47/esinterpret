import { Realm } from '../environment/Realm';
import { CreateIntrinsics } from './CreateIntrinsics';

export function CreateRealm() {
  const realm = new Realm();

  CreateIntrinsics(realm);

  realm.__GlobalObject = undefined;
  realm.__GlobalEnv = undefined;
  realm.__TemplateMap = [];

  return realm;
}
