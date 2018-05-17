import { AbstractLevelDOWN } from "abstract-leveldown";

// TODO: this should get the class from node_modules, not just
// my type definition
import IDBStore from "idb-wrapper";

type O = {};
type GO = any;
type PO = any;
type DO = any;
type K = any;
type V = any;

export class BrowseDown extends AbstractLevelDOWN {
  _open(opts: O, callback: (err?: any) => void): void {}

  _close(callback: (err?: any) => void): void {}

  _get(key: K, options: GO, callback: (err: any, value: V) => any): void {}

  _put(key: K, value: V, options: PO, callback: (err: any) => any): void {}

  _del(key: K, options: DO, callback: (err: any) => any): void {}
}

export function makeDB(
  name: string,
  onStoreReady: IDBWrapper.readyFn
): IDBWrapper.IDBStore {
  return new IDBStore({ storeName: name }, onStoreReady);
}
