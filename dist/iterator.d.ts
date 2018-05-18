import { AbstractIterator, AbstractIteratorOptions } from "abstract-leveldown";
import { K, KVPair, V } from "./types";
export declare class Iterator extends AbstractIterator<K, V> {
    protected stop: boolean;
    protected results: KVPair[];
    constructor(idb: IDBWrapper.IDBStore, options: AbstractIteratorOptions);
    _next(callback: (err: any, key?: K, value?: V) => void): void;
    _end(callback: (err: any) => void): void;
    protected onItem(value: V, cursor: IDBWrapper.IDBCursor): void;
    protected finish(): void;
    protected convertOptions(idb: IDBWrapper.IDBStore, opts: AbstractIteratorOptions): IDBWrapper.IterateOptions;
}
