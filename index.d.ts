/**
Consume a `ReadableStream` into a string.

@param readableStream - The stream to consume.
@returns The concatenated string content.

@example
```
import {streamToString} from 'stream-to-value';

const stream = new ReadableStream({
	start(controller) {
		controller.enqueue('hello ');
		controller.enqueue('world');
		controller.close();
	},
});

await streamToString(stream);
//=> 'hello world'
```
*/
export function streamToString(readableStream: ReadableStream): Promise<string>;

/**
Consume a `ReadableStream` into a `Uint8Array`.

@param readableStream - The stream to consume.
@returns The concatenated bytes.

@example
```
import {streamToUint8Array} from 'stream-to-value';

const stream = new ReadableStream({
	start(controller) {
		controller.enqueue(new Uint8Array([1, 2, 3]));
		controller.close();
	},
});

await streamToUint8Array(stream);
//=> Uint8Array [1, 2, 3]
```
*/
export function streamToUint8Array(readableStream: ReadableStream): Promise<Uint8Array>;

/**
Consume a `ReadableStream` and parse the content as JSON.

@param readableStream - The stream to consume.
@returns The parsed JSON value.

@example
```
import {streamToJson} from 'stream-to-value';

const stream = new ReadableStream({
	start(controller) {
		controller.enqueue('{"key": "value"}');
		controller.close();
	},
});

await streamToJson(stream);
//=> {key: 'value'}
```
*/
export function streamToJson(readableStream: ReadableStream): Promise<unknown>;

/**
Consume a `ReadableStream` into an array of chunks.

@param readableStream - The stream to consume.
@returns An array of all chunks from the stream.

@example
```
import {streamToArray} from 'stream-to-value';

const stream = new ReadableStream({
	start(controller) {
		controller.enqueue('a');
		controller.enqueue('b');
		controller.enqueue('c');
		controller.close();
	},
});

await streamToArray(stream);
//=> ['a', 'b', 'c']
```
*/
export function streamToArray(readableStream: ReadableStream): Promise<unknown[]>;
