declare namespace IDBWrapper {
  export interface IDBStoreConstructor {
    new(kwargs?: InitOptions, onStoreReady?: readyFn): IDBStore;
    IDBStore: IDBStore;
  }

  type readyFn = () => void;
  type errorFn = (err: any) => void;
  type resultFn = (val: Object) => void;
  type multiResultFn = (vals: Object[]) => void;

  export interface IndexData {
    name: string;
    keyPath?: string;
    unique?: boolean;
    multiEntry?: boolean;
  }

  enum ImplementationPreference {
    IndexedDB = 'indexedDB',
    WebKit = 'webkitIndexedDB',
    Mozilla = 'mozIndexedDB',
    Shim = 'shimIndexedDB',
  }

  export interface InitOptions {
    storeName?: string; // Default: 'Store'
    storePrefix?: string; // Default: 'IDBWrapper-'
    dbVersion?: number; // Default: 1
    keyPath?: string | null; // Default: 'id'
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

  enum ArrayType {
    Sparse = 'Sparse',
    Dense = 'Dense',
    Skip = 'Skip',
  }

  enum Order {
    ASC = 'ASC',
    DESC = 'DESC',
  }

  export interface KeyRangeOptions {
    lower?: any; // the lower bound
    excludeLower?: boolean;
    upper?: any; // the upper bound
    excludeUpper?: boolean;
    only?: any;  // use for range of one key, overrides the rest
  }

  // these are shared between query and iterate
  export interface CommonOptions {
    index?: string;
    // order?: Order; // default: ASC
    order?: string; // default: ASC
    filterDuplicates?: boolean; // default: false
    keyRange?: IDBKeyRange;
    onError?: errorFn;
    limit?: number;
    offset?: number;
  }

  export interface QueryOptions extends CommonOptions {
    filter?: (val: Object) => boolean; // must return false to reject an item
  }

  export interface IterateOptions extends CommonOptions {
    autoContinue?: boolean; 
    writeAccess?: boolean; // Default: false (whether the callback can write)
    onEnd?: readyFn;
    allowItemRejection?: boolean; // If true, onItem can return false to reject the current item
  }

  export interface UpsertOptions {
    // Specifies a field in the record to update with the 
    // auto-incrementing key. Defaults to the store's keyPath.
    keyField?: string;
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

    new (kwargs?: InitOptions, onStoreReady?: readyFn): IDBStore;

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
    iterate(onItem: (val: Object, cursor: IDBCursor) => void|boolean, options?: IterateOptions): IDBTransaction;
    makeKeyRange(options: KeyRangeOptions): IDBKeyRange;
    // normalizeIndexData
    put(value: Object, onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
    put(key: any, value: Object, onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
    putBatch(dataArray: Object[], onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
    query(onSuccess: multiResultFn, options?: QueryOptions): IDBTransaction;
    remove(key: any, onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
    removeBatch(key: any[], onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
    upsertBatch(dataArray: Object[], options?: UpsertOptions, onSuccess?: readyFn, onError?: errorFn): IDBTransaction;
  }

  // These items are passed directly from the IndexDB implementation
  // and can be considered opaque for now....
  // Maybe later we can make interfaces with the common functionality


  export interface IDBDatabase {
    close(): void;
  }

  export interface IDBCursor {
    // This is all we should touch during iteration....
    readonly key: any;
    readonly value: any;
  }

  // interface IDBObjectStore {}
  // interface IDBTransaction {}
  // interface IDBKeyRange {}
}

declare module 'idb-wrapper' {
  const Default : IDBWrapper.IDBStoreConstructor;
  export = Default;
}
