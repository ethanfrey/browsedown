import { AbstractLevelDOWN } from "abstract-leveldown";

// TODO: this should get the class from node_modules, not just
// my type definition
import IDBStore from "idb-wrapper";

type O = {};

interface GO {
  asBuffer?: boolean;
  raw?: boolean;
}

interface PO {
  raw?: boolean;
  valueEncoding?: string;
}

type DO = any;
type K = any;
type V = any;

export class BrowseDown extends AbstractLevelDOWN {
  idb: IDBWrapper.IDBStore | null;

  constructor(name: string) {
    super(name);
    this.idb = null;
  }

  _open(opts: O, callback: (err?: any) => void): void {
    const options = {
      storeName: this.location as string,
      autoIncrement: false,
      keyPath: null,
      onStoreReady: () => callback && callback(),
      onError: (err: any) => callback && callback(err)
    };
    this.idb = new IDBStore(options);
  }

  _close(callback: (err?: any) => void): void {
    if (this.idb != null) {
      this.idb.db.close();
      this.idb = null;
    }
    callback();
  }

  _get(
    key: K,
    options: GO,
    callback: (err: any, value?: V, key?: K) => void
  ): void {
    if (this.idb == null) {
      return callback(new Error("Database not open"));
    }
    this.idb.get(
      key,
      function(value) {
        if (value === undefined) {
          // 'NotFound' error, consistent with LevelDOWN API
          return callback(new Error("NotFound"));
        }
        // by default return buffers, unless explicitly told not to
        let asBuffer = true;
        if (options.asBuffer === false) asBuffer = false;
        if (options.raw) asBuffer = false;
        if (asBuffer) {
          // TODO: revisit this
          if (value instanceof Uint8Array) value = new Buffer(value);
          else value = new Buffer(String(value));
        }
        return callback(null, value, key);
      },
      callback
    );
  }

  _put(key: K, value: V, options: PO, callback: (err?: any) => void): void {
    if (this.idb == null) {
      return callback(new Error("Database not open"));
    }
    // if (value instanceof ArrayBuffer) {
    //   value = toBuffer(new Uint8Array(value))
    // }
    let obj = this.convertEncoding(key, value, options);
    // if (Buffer.isBuffer(obj.value)) {
    //   if (typeof value.toArrayBuffer === 'function') {
    //     obj.value = new Uint8Array(value.toArrayBuffer())
    //   } else {
    //     obj.value = new Uint8Array(value)
    //   }
    // }
    this.idb.put(obj.key, obj.value, () => callback(), callback);
  }

  _del(key: K, options: DO, callback: (err?: any) => any): void {
    if (this.idb == null) {
      return callback(new Error("Database not open"));
    }
    this.idb.remove(key, callback, callback);
  }

  convertEncoding(key: any, value: any, options: PO): Model {
    if (options.raw) return { key: key, value: value };
    if (value) {
      var stringed = value.toString();
      if (stringed === "NaN") value = "NaN";
    }
    var valEnc = options.valueEncoding;
    var obj = { key: key, value: value };
    if (value && (!valEnc || valEnc !== "binary")) {
      if (typeof obj.value !== "object") {
        obj.value = stringed;
      }
    }
    return obj;
  }
}

interface Model {
  key: any;
  value: any;
}

export function makeDB(
  name: string,
  onStoreReady: IDBWrapper.readyFn
): IDBWrapper.IDBStore {
  return new IDBStore({ storeName: name }, onStoreReady);
}
