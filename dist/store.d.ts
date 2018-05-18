import { AbstractIteratorOptions, AbstractLevelDOWN } from "abstract-leveldown";
import { Iterator } from "./iterator";
import { BO, DO, GO, IO, K, O, PO, V } from "./types";
export declare class BrowseDown extends AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO> {
    protected idb: IDBWrapper.IDBStore | null;
    constructor(name: string);
    _open(opts: O, callback: (err?: any) => void): void;
    _close(callback: (err?: any) => void): void;
    _get(key: K, options: GO, callback: (err: any, value?: V, key?: K) => void): void;
    _put(key: K, value: V, options: PO, callback: (err?: any) => void): void;
    _del(key: K, options: DO, callback: (err?: any) => any): void;
    _iterator(options: AbstractIteratorOptions<K>): Iterator;
    private convertEncoding(key, value, options);
}
