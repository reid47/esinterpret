import { UndefinedValue } from '../values/UndefinedValue';

export class Realm {
  __GlobalObject;
  __GlobalEnv;
  __TemplateMap;
  __Intrinsics;

  undefinedValue = new UndefinedValue(this);
}
