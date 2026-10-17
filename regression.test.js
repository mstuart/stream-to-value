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
