// set the options arguments here
export type O = object;

export interface GO {
  asBuffer?: boolean;
  raw?: boolean;
}

export interface PO {
  raw?: boolean;
  valueEncoding?: string;
}

export type DO = object;
export type IO = object;
export type BO = object;
export type K = any;
export type V = any;

export interface KVPair {
  key: K;
  value: V;
}
