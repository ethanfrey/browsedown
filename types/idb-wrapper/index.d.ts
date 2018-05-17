export type readyFn = () => void;
export type errorFn = (err: any) => void;
export type resultFn = (val: any) => void;
export type multiResultFn = (vals: any[]) => void;

export interface IndexData {
  name: string;
  keyPath?: string;
  unique?: boolean;
  multiEntry?: boolean;
}

export enum ImplementationPreference {
  IndexedDB = 'indexedDB',
  WebKit = 'webkitIndexedDB',
  Mozilla = 'mozIndexedDB',
  Shim = 'shimIndexedDB',
}

export interface InitOptions {
  storeName?: string; // Default: 'Store'
  storePrefix?: string; // Default: 'IDBWrapper-'
  dbVersion?: number; // Default: 1
  keyPath?: string; // Default: 'id'
  autoincrement?: boolean; // Default: true
  onStoreReady?: readyFn;
  onError?: errorFn;
  indexes?: IndexData[];
  implementationPreference?: ImplementationPreference[];
}

export interface CountOptions {
  index?: string;
  keyRange?: IDBKeyRange;
  onError?: errorFn;
}

export enum ArrayType {
  Sparse = 'Sparse',
  Dense = 'Dense',
  Skip = 'Skip',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface KeyRangeOptions {
  lower?: any; // the lower bound
  excludeLower?: boolean;
  upper?: any; // the upper bound
  excludeUpper?: boolean;
  only: any;  // use for range of one key, overrides the rest
}

export interface QueryOptions {
  index?: string;
  order?: Order; // default: ASC
  filterDuplicates?: boolean; // default: false
  keyRange?: IDBKeyRange;
  onError?: errorFn;
  limit?: number;
  offset?: number;
  filter?: (val: Object) => boolean; // must return false to reject an item
}

export interface UpsertOptions {
  // Specifies a field in the record to update with the 
  // auto-incrementing key. Defaults to the store's keyPath.
  keyField?: string;
}

export interface IDBKeyRange {
  // TODO
}

export interface IDBStoreConstructor {
  new(kwargs?: InitOptions, onStoreReady?: readyFn): IDBStore;
}

export interface IDBStore {
  autoIncrement: boolean;
  db: IDBDatabase;
  dbName: string;
  dbVersion: number;
  implementation: string;
  implementationPreference: ImplementationPreference[];
  indexes: IndexData[];
  keyPath: string;
  onError: errorFn;
  onStoreReady: readyFn;
  store: IDBObjectStore;
  storeName: string;
  storePrefix: string;
  version: string;

  // batch
  clear(onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
  count(onSuccess: readyFn, options?: CountOptions): IDBTransaction;
  deleteDatabase(onSuccess?: readyFn, onError?: errorFn): void;
  get(key: any, onSuccess: resultFn, onError?: errorFn): IDBTransaction;
  getAll(onSuccess: multiResultFn, onError?: errorFn): IDBTransaction;
  getBatch(keyArray: any[], onSuccess: multiResultFn, onError?: errorFn, arrayType?: ArrayType): IDBTransaction;
  // getIndexList
  hasIndex(indexName: string): boolean;
  // indexCompiles
  // iterate: TODO
  makeKeyRange(options: KeyRangeOptions): IDBKeyRange;
  // normalizeIndexData
  put(value: Object, onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
  put(key: any, value: Object, onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
  putBatch(dataArray: Object[], onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
  // query: TODO
  query(onSuccess: multiResultFn, options?: QueryOptions): IDBTransaction;
  remove(key: any, onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
  removeBatch(key: any[], onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
  upsertBatch(dataArray: Object[], options?: UpsertOptions, onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
}

export interface IDBDatabase {
  // TODO
}

export interface IDBObjectStore {
  // TODO
}

export interface IDBTransaction {
  // TODO
}