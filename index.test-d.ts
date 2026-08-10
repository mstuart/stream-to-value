import { expectType } from "tsd";
import {
  streamToArray,
  streamToJson,
  streamToString,
  streamToUint8Array,
} from "./index.js";

const stream = new ReadableStream();

expectType<Promise<string>>(streamToString(stream));
expectType<Promise<Uint8Array>>(streamToUint8Array(stream));
expectType<Promise<unknown>>(streamToJson(stream));
expectType<Promise<unknown[]>>(streamToArray(stream));
