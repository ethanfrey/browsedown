import { AbstractIteratorOptions, AbstractLevelDOWN } from "abstract-leveldown";
import IDBStore from "idb-wrapper";

import { Iterator } from "./iterator";

type O = object;

interface GO {
  asBuffer?: boolean;
  raw?: boolean;
}

interface PO {
  raw?: boolean;
  valueEncoding?: string;
}

type DO = object;
type IO = object;
type BO = object;
type K = any;
type V = any;

export class BrowseDown extends AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO> {
  protected idb: IDBWrapper.IDBStore | null;

  constructor(name: string) {
    super(name);
    this.idb = null;
  }

  public _open(opts: O, callback: (err?: any) => void): void {
    const options = {
      autoIncrement: false,
      keyPath: null,
      onError: (err: any) => callback && callback(err),
      onStoreReady: () => callback && callback(),
      storeName: this.location as string
    };
    this.idb = new IDBStore(options);
  }

  public _close(callback: (err?: any) => void): void {
    if (this.idb != null) {
      this.idb.db.close();
      this.idb = null;
    }
    callback();
  }

  public _get(
    key: K,
    options: GO,
    callback: (err: any, value?: V, key?: K) => void
  ): void {
    if (this.idb == null) {
      return callback(new Error("Database not open"));
    }
    const cleanResult = (value: any) => {
      if (value === undefined) {
        // 'NotFound' error, consistent with LevelDOWN API
        return callback(new Error("NotFound"));
      }
      // by default return buffers, unless explicitly told not to
      let asBuffer = true;
      if (options.raw || options.asBuffer === false) {
        asBuffer = false;
      }
      let bufValue: any = value;
      if (asBuffer) {
        // TODO: revisit this
        bufValue =
          value instanceof Uint8Array
            ? Buffer.from(value.buffer)
            : Buffer.from(String(value));
      }
      return callback(null, bufValue, key);
    };
    this.idb.get(key, cleanResult, callback);
  }

  public _put(
    key: K,
    value: V,
    options: PO,
    callback: (err?: any) => void
  ): void {
    if (this.idb == null) {
      return callback(new Error("Database not open"));
    }
    // if (value instanceof ArrayBuffer) {
    //   value = toBuffer(new Uint8Array(value))
    // }
    const obj = this.convertEncoding(key, value, options);
    // if (Buffer.isBuffer(obj.value)) {
    //   if (typeof value.toArrayBuffer === 'function') {
    //     obj.value = new Uint8Array(value.toArrayBuffer())
    //   } else {
    //     obj.value = new Uint8Array(value)
    //   }
    // }
    this.idb.put(obj.key, obj.value, () => callback(), callback);
  }

  public _del(key: K, options: DO, callback: (err?: any) => any): void {
    if (this.idb == null) {
      return callback(new Error("Database not open"));
    }
    this.idb.remove(key, callback, callback);
  }

  public _iterator(options: AbstractIteratorOptions<K>): Iterator {
    if (this.idb == null) {
      throw new Error("Database not open");
    }
    return new Iterator(this.idb, options);
  }

  private convertEncoding(key: any, value: any, options: PO): Model {
    if (options.raw) {
      return { key, value };
    }
    const valEnc = options.valueEncoding;
    let myVal: any = value;
    if (value) {
      const stringed = value.toString();
      if (stringed === "NaN") {
        myVal = "NaN";
      } else if (valEnc !== "binary" && typeof value !== "object") {
        myVal = stringed;
      }
    }
    return { key, value: myVal };
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
