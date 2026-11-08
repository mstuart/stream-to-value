import test from "ava";
import { streamToUint8Array } from "./index.js";

test("snapshots bytes before the producer reuses its buffer", async (t) => {
  const buffer = new Uint8Array(1);
  let next = 1;
  const source = new ReadableStream(
    {
      pull(controller) {
        if (next > 2) {
          controller.close();
          return;
        }
        buffer[0] = next;
        next += 1;
        controller.enqueue(buffer);
      },
    },
    { highWaterMark: 0 }
  );
  t.deepEqual(await streamToUint8Array(source), new Uint8Array([1, 2]));
});

test("encodes a Unicode scalar split across string chunks", async (t) => {
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of ["before\uD83D", "", "\uDE00after"]) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
  t.deepEqual(
    await streamToUint8Array(stream),
    new TextEncoder().encode("before😀after")
  );
});

test("flushes unmatched string surrogates before bytes and at end", async (t) => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue("\uD83D");
      controller.enqueue(new Uint8Array([65]));
      controller.enqueue("\uD83D");
      controller.close();
    },
  });
  t.deepEqual(
    await streamToUint8Array(stream),
    new TextEncoder().encode("�A�")
  );
});
