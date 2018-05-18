import { AbstractIterator, AbstractIteratorOptions } from "abstract-leveldown";
// How to import enum from namespace???
// import { Order } from 'idb-wrapper';

import { cleanResult, K, KVPair, V } from "./types";

export type NextCallback = (err?: any, key?: K, value?: V) => void;

export interface IteratorOptions extends AbstractIteratorOptions {
  keyAsBuffer?: boolean;
  valueAsBuffer?: boolean;
}

export class Iterator extends AbstractIterator<K, V> {
  protected stop: boolean;
  protected results: KVPair[];
  protected callback: NextCallback | null;
  protected opts: IDBWrapper.IterateOptions;
  protected idb: IDBWrapper.IDBStore;
  protected cleanKey: boolean;
  protected cleanValue: boolean;

  constructor(idb: IDBWrapper.IDBStore, options: IteratorOptions) {
    super(null);
    this.stop = false;
    this.results = [];
    this.callback = null;
    this.opts = this.convertOptions(idb, options || {});
    this.idb = idb;
    this.cleanKey = options.keyAsBuffer !== false;
    this.cleanValue = options.valueAsBuffer !== false;
    // we start in the constructor to make a snapshot at this
    // time, not at first iteration
    this.idb.iterate(this.onItem.bind(this), this.opts);
  }

  public _next(callback: NextCallback): void {
    // start the iterator on the first call to next
    const waiting = this.results.shift();
    if (waiting) {
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
    this.stop = true;
    this.callback = null;
    process.nextTick(callback);
  }

  protected onItem(value: V, cursor: IDBWrapper.IDBCursor): void {
    const clean = cleanResult();
    const pair = {
      key: this.cleanKey ? clean(cursor.key) : cursor.key,
      value: this.cleanValue ? clean(cursor.value) : cursor.value
    };

    if (!this.callback) {
      this.results.push(pair);
      cursor.continue();
      return;
    }
    if (this.stop || !value) {
      return this.callback();
    }
    const cb = this.callback;
    this.callback = null;
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
        this.finish();
      }, // ????
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
