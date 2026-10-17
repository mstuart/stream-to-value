import test from "ava";
import { streamToString } from "./index.js";

test("mixed string chunks flush pending UTF-8 bytes in source order", async (t) => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array([0xe2]));
      controller.enqueue("middle");
      controller.enqueue(new TextEncoder().encode("end"));
      controller.close();
    },
  });
  t.is(await streamToString(stream), "\uFFFDmiddleend");
});

test("empty string chunks do not interrupt a split UTF-8 character", async (t) => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array([0xf0, 0x9f]));
      controller.enqueue("");
      controller.enqueue(new Uint8Array([0x98, 0x80]));
      controller.close();
    },
  });
  t.is(await streamToString(stream), "\u{1f600}");
});

test("string boundaries preserve mid-stream byte-order marks", async (t) => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("a"));
      controller.enqueue("x");
      controller.enqueue(new Uint8Array([0xef, 0xbb, 0xbf, 0x62]));
      controller.close();
    },
  });
  t.is(await streamToString(stream), "ax\uFEFFb");
});

test("the leading byte-order mark is still stripped from the first byte run", async (t) => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue("prefix");
      controller.enqueue(new Uint8Array([0xef, 0xbb, 0xbf, 0x62]));
      controller.close();
    },
  });
  t.is(await streamToString(stream), "prefixb");
});
