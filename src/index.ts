export { Iterator } from "./iterator";
export { BrowseDown } from "./store";
export { BO, DO, GO, IO, K, O, PO, V } from "./types";

import IDBStore from "idb-wrapper";

export function makeDB(
  name: string,
  onStoreReady: IDBWrapper.readyFn
): IDBWrapper.IDBStore {
  return new IDBStore({ storeName: name }, onStoreReady);
}
