import {
  AbstractIteratorOptions,
  AbstractLevelDOWN,
  Batch
} from "abstract-leveldown";
import IDBStore from "idb-wrapper";

import { Iterator } from "./iterator";
import { BO, cleanResult, DO, GO, IO, K, KVPair, O, PO, V } from "./types";

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
    const onSuccess = (val: any) => {
      if (val === undefined) {
        // 'NotFound' error, consistent with LevelDOWN API
        return callback(new Error("NotFound"));
      }
      const value = cleanResult(options)(val);
      callback(undefined, value, key);
    };
    this.idb.get(key, onSuccess, callback);
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

  public _del(key: K, options: DO, callback: (err?: any) => void): void {
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

  public _batch(
    items: ReadonlyArray<Batch<K, V>>,
    options: BO,
    callback: (err?: any) => void
  ): void {
    if (this.idb == null) {
      throw new Error("Database not open");
    }

    if (items.length === 0) {
      return process.nextTick(callback);
    }

    const prepared: IDBWrapper.BatchItem[] = [];
    for (const item of items) {
      if (item.type === "del") {
        const convert = this.convertEncoding(item.key, "", {});
        const clean: IDBWrapper.BatchItem = {
          key: convert.key,
          type: "remove"
        };
        prepared.push(clean);
      } else {
        const convert = this.convertEncoding(item.key, item.value, {});
        const clean: IDBWrapper.BatchItem = {
          key: convert.key,
          type: "put",
          value: convert.value
        };
        prepared.push(clean);
      }
    }

    this.idb.batch(prepared, () => callback(), callback);
  }

  private convertEncoding(key: any, value: any, options: PO): KVPair {
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
