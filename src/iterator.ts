import { AbstractIterator, AbstractIteratorOptions } from "abstract-leveldown";
// How to import enum from namespace???
// import { Order } from 'idb-wrapper';

import { K, KVPair, V } from "./types";

export class Iterator extends AbstractIterator<K, V> {
  protected stop: boolean;
  protected results: KVPair[];

  constructor(idb: IDBWrapper.IDBStore, options: AbstractIteratorOptions) {
    super(null);
    this.stop = false;
    this.results = [];
    const opts = this.convertOptions(idb, options || {});
    idb.iterate(this.onItem.bind(this), opts);
  }

  public _next(callback: (err: any, key?: K, value?: V) => void): void {
    const item = this.results.shift();
    if (!item) {
      // this.end(this.finish.bind(this));
      // process.nextTick(callback, new Error("Hit end of iterator"));
      process.nextTick(callback); // no key or value means stop
    } else {
      process.nextTick(callback, undefined, item.key, item.value);
    }
  }

  public _end(callback: (err: any) => void): void {
    this.stop = true;
    process.nextTick(callback);
  }

  protected onItem(value: V, cursor: IDBWrapper.IDBCursor): void {
    if (this.stop || !value) {
      return;
    }
    const pair = { key: cursor.key, value };
    this.results.push(pair);
  }

  protected finish(): void {
    this.stop = true;
  }

  protected convertOptions(
    idb: IDBWrapper.IDBStore,
    opts: AbstractIteratorOptions
  ): IDBWrapper.IterateOptions {
    const result: IDBWrapper.IterateOptions = {
      autoContinue: true,
      limit: opts.limit,
      onEnd: this.finish.bind(this),
      // onError: ????
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
