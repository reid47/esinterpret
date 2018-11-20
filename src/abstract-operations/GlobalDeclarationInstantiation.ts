import { Realm } from '../environment/Realm';
import { ObjectValue } from '../values/ObjectValue';
import { NullValue } from '../values/NullValue';
import { BooleanValue } from '../values/BooleanValue';
import { ScriptRecord } from '../environment/ScriptRecord';
import { LexicalEnvironment } from '../environment/LexicalEnvironment';
import * as Nodes from '@babel/types';
import { assert } from '../assert';
import { GlobalEnvironmentRecord } from '../environment/GlobalEnvironmentRecord';
import { StringValue } from '../values/StringValue';

const getBoundNames = (decl: Nodes.Declaration): string[] => {
  const names = [];

  if (decl.type === 'VariableDeclaration') {
    decl.declarations.forEach(declarator => {
      const id = declarator.id;
      if (id.type === 'Identifier') names.push(id.name);
      // TODO: this is incomplete, since the declarator could be
      // a number of things (e.g. an array destructuring pattern),
      // rather than just an identifier, and then we would find the
      // bind names differently
    });
  } else if (decl.type === 'FunctionDeclaration' || decl.type === 'ClassDeclaration') {
    names.push(decl.id);
  }

  return names;
};

// ECMA-262 15.1.11
export function GlobalDeclarationInstantiation(script: Nodes.File, env: LexicalEnvironment) {
  // 1.
  const envRec = env.environmentRecord as GlobalEnvironmentRecord;
  const realm = envRec.__Realm;

  // 2.
  assert(envRec instanceof GlobalEnvironmentRecord, 'should be a global environment record');

  // 3.
  const lexNames: StringValue[] = []; // TODO

  // 4.
  const varNames: StringValue[] = []; // TODO

  // 5.
  for (const name of lexNames) {
    if (envRec.HasVarDeclaration(name)) {
      throw new SyntaxError(`Already defined: '${name.value}'`);
    }

    if (envRec.HasLexicalDeclaration(name)) {
      throw new SyntaxError(`Already defined: '${name.value}'`);
    }

    const hasRestrictedGlobal = envRec.HasRestrictedGlobalProperty(name);
    if (hasRestrictedGlobal) {
      throw new SyntaxError(`Restricted global: '${name.value}'`);
    }
  }

  // 6.
  for (const name of varNames) {
    if (envRec.HasLexicalDeclaration(name)) {
      throw new SyntaxError(`Already defined: '${name.value}'`);
    }
  }

  // 7.
  const varDeclarations: Nodes.Declaration[] = []; // TODO

  // 8.
  const functionsToInitialize = [];

  // 9.
  const declaredFunctionNames = [];

  // 10.
  for (const decl of varDeclarations.reverse()) {
    if (decl.type !== 'VariableDeclaration') {
      assert(decl.type === 'FunctionDeclaration', 'should be a function declaration');

      const boundNames = getBoundNames(decl);
      const fn = boundNames[0];

      if (declaredFunctionNames.indexOf(fn) === -1) {
        const fnDefinable = envRec.CanDeclareGlobalFunction(new StringValue(realm, fn));

        if (!fnDefinable) {
          throw new TypeError(`Cannot define function: ${fn}`);
        }

        declaredFunctionNames.push(fn);
        functionsToInitialize.unshift(decl);
      }
    }
  }

  // 11.
  const declaredVarNames: string[] = [];

  // 12.
  for (const decl of varDeclarations.reverse()) {
    if (decl.type === 'VariableDeclaration') {
      const boundNames = getBoundNames(decl);

      for (const vn of boundNames) {
        if (declaredFunctionNames.indexOf(vn) === -1) {
          const vnDefinable = envRec.CanDeclareGlobalVar(new StringValue(realm, vn));

          if (!vnDefinable) {
            throw new TypeError(`Cannot define variable: ${vn}`);
          }

          if (declaredVarNames.indexOf(vn) === -1) {
            declaredVarNames.push(vn);
          }
        }
      }
    }
  }

  // 15.
  const lexDeclarations: Nodes.VariableDeclaration[] = [];

  for (const decl of script.program.body) {
    if (decl.type === 'VariableDeclaration' && decl.kind !== 'var') {
      lexDeclarations.push(decl);
    }
  }

  // 16.
  for (const decl of lexDeclarations) {
    for (const dn of getBoundNames(decl)) {
      if (decl.kind === 'const') {
        envRec.CreateImmutableBinding(new StringValue(realm, dn), true);
      } else {
        envRec.CreateMutableBinding(new StringValue(realm, dn), false);
      }
    }
  }

  // 17.
  // TODO

  // 18.
  for (const vn of declaredVarNames) {
    envRec.CreateGlobalVarBinding(new StringValue(realm, vn), false);
  }
}
