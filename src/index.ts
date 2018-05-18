import { BrowseDown } from ".";

export { Iterator } from "./iterator";
export { BrowseDown } from "./store";
export { BO, DO, GO, IO, K, O, PO, V } from "./types";

export function browsedown(name: string): BrowseDown {
  return new BrowseDown(name);
}
