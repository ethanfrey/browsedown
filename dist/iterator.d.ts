import { AbstractIterator, AbstractIteratorOptions } from "abstract-leveldown";
import { K, KVPair, V } from "./types";
export declare type NextCallback = (err?: any, key?: K, value?: V) => void;
export interface IteratorOptions extends AbstractIteratorOptions {
    keyAsBuffer?: boolean;
    valueAsBuffer?: boolean;
}
export declare class Iterator extends AbstractIterator<K, V> {
    protected stop: boolean;
    protected results: KVPair[];
    protected callback: NextCallback | null;
    protected opts: IDBWrapper.IterateOptions;
    protected idb: IDBWrapper.IDBStore;
    protected cleanKey: boolean;
    protected cleanValue: boolean;
    constructor(idb: IDBWrapper.IDBStore, options: IteratorOptions);
    _next(callback: NextCallback): void;
    _end(callback: (err: any) => void): void;
    protected onItem(value: V, cursor: IDBWrapper.IDBCursor): void;
    protected finish(): void;
    protected convertOptions(idb: IDBWrapper.IDBStore, opts: AbstractIteratorOptions): IDBWrapper.IterateOptions;
}
