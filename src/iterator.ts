import { AbstractIterator, AbstractIteratorOptions } from "abstract-leveldown";

type K = any;
type V = any;

export class Iterator extends AbstractIterator<K, V> {
  protected stop: boolean;
  protected results: KVPair[];

  constructor(idb: IDBWrapper.IDBStore, options: AbstractIteratorOptions) {
    super(null);
    this.stop = false;
    this.results = [];
    const opts = this.convertOptions(options);
    idb.iterate(this.onItem.bind(this), opts);
  }

  public _next(callback: (err: any, key?: K, value?: V) => void): void {
    const item = this.results.shift();
    if (!item) {
      this.end(this.finish.bind(this));
      process.nextTick(callback, new Error("Hit end of iterator"));
    } else {
      process.nextTick(callback, null, item.key, item.value);
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
    options: AbstractIteratorOptions
  ): IDBWrapper.IterateOptions {
    return {
      onEnd: this.finish.bind(this)
    };
  }
}

interface KVPair {
  key: K;
  value: V;
}
