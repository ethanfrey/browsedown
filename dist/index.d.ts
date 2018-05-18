export { Iterator } from "./iterator";
export { BrowseDown } from "./store";
export { BO, DO, GO, IO, K, O, PO, V } from "./types";
export declare function makeDB(name: string, onStoreReady: IDBWrapper.readyFn): IDBWrapper.IDBStore;
