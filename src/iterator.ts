import { AbstractIterator, AbstractIteratorOptions } from "abstract-leveldown";
// How to import enum from namespace???
// import { Order } from 'idb-wrapper';

import { cleanResult, K, KVPair, V } from "./types";

export type NextCallback = (err?: any, key?: K, value?: V) => void;

export class Iterator extends AbstractIterator<K, V> {
  protected stop: boolean;
  protected started: boolean;
  protected results: KVPair[];
  protected callback: NextCallback | null;
  protected opts: IDBWrapper.IterateOptions;
  protected idb: IDBWrapper.IDBStore;

  constructor(idb: IDBWrapper.IDBStore, options: AbstractIteratorOptions) {
    super(null);
    this.stop = false;
    this.started = false;
    this.results = [];
    this.callback = null;
    this.opts = this.convertOptions(idb, options || {});
    this.idb = idb;
  }

  public _next(callback: NextCallback): void {
    // start the iterator on the first call to next
    console.log("*** _next");
    if (!this.started) {
      console.log("*** STARTED");
      this.started = true;
      this.idb.iterate(this.onItem.bind(this), this.opts);
      this.callback = callback;
      return;
    }
    const waiting = this.results.shift();
    if (waiting) {
      console.log("got answer");
      process.nextTick(callback, undefined, waiting.key, waiting.value);
      return;
    }
    if (this.stop) {
      // if we hit the end, just return null
      process.nextTick(callback);
    }
    // otherwise on next onItem
    this.callback = callback;
  }

  public _end(callback: (err: any) => void): void {
    console.log("*** ENDED");
    this.stop = true;
    this.callback = null;
    process.nextTick(callback);
  }

  protected onItem(value: V, cursor: IDBWrapper.IDBCursor): void {
    console.log("*** onItem", value, cursor.key);
    const clean = cleanResult();
    const pair = {
      key: clean(cursor.key),
      value: clean(cursor.value)
    };

    if (!this.callback) {
      this.results.push(pair);
      console.log("no callback.... storing for later");
      return;
    }
    if (this.stop || !value) {
      return this.callback();
    }
    const cb = this.callback;
    this.callback = null;
    // process.nextTick(cb, undefined, pair.key, pair.value);
    cb(undefined, pair.key, pair.value);
    cursor.continue();
  }

  protected finish(): void {
    this.stop = true;
    // if we hit the end, and waiting for next, let them know
    if (this.callback) {
      this.callback();
      this.callback = null;
    }
  }

  protected convertOptions(
    idb: IDBWrapper.IDBStore,
    opts: AbstractIteratorOptions
  ): IDBWrapper.IterateOptions {
    const result: IDBWrapper.IterateOptions = {
      autoContinue: false,
      limit: opts.limit,
      onEnd: this.finish.bind(this),
      onError: () => {
        console.log("ERROR");
        this.finish();
      }, // ????
      // onError: (a: any, b?: any, c?: any) => console.log('horrible error', a, b, c),
      order: opts.reverse ? "DESC" : "ASC"
    };
    if (opts.gt || opts.gte || opts.lt || opts.lte) {
      const rangeOpts = {
        excludeLower: !!opts.gt,
        excludeUpper: !!opts.lt,
        lower: opts.gte || opts.gt,
        upper: opts.lte || opts.lt
      };
      result.keyRange = idb.makeKeyRange(rangeOpts);
    }
    return result;
  }
}
