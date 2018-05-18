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

export const cleanResult = (opts: GO = {}) => (value: any): any => {
  // by default return buffers, unless explicitly told not to
  let asBuffer = true;
  if (opts.raw || opts.asBuffer === false) {
    asBuffer = false;
  }
  let bufValue: any = value;
  if (asBuffer) {
    // TODO: revisit this
    bufValue =
      value instanceof Uint8Array
        ? Buffer.from(value.buffer)
        : Buffer.from(String(value));
  }
  return bufValue;
};
