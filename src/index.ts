import { AbstractLevelDOWN } from "abstract-leveldown";
// export * from "idb-wrapper";

/*
Figure out how to compile typescript for the web....

http://www.jbrantly.com/typescript-and-webpack/
https://webpack.js.org/guides/typescript/

*/

type O = any;
type GO = any;
type PO = any;
type DO = any;
type K = any;
type V = any;

export class BrowseDown extends AbstractLevelDOWN {
  _open(opts: O, callback: (err?: any) => void): void {}

  _close(callback: (err?: any) => void): void {}

  _get(key: K, options: GO, callback: (err: any, value: V) => any): void {}

  _put(key: K, value: V, options: PO, callback: (err: any) => any): void {}

  _del(key: K, options: DO, callback: (err: any) => any): void {}
}
