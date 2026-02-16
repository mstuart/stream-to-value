import test from 'ava';
import {
	streamToString,
	streamToUint8Array,
	streamToJson,
	streamToArray,
} from './index.js';

function createStringStream(...chunks) {
	return new ReadableStream({
		start(controller) {
			for (const chunk of chunks) {
				controller.enqueue(chunk);
			}

			controller.close();
		},
	});
}

function createByteStream(...chunks) {
	return new ReadableStream({
		start(controller) {
			for (const chunk of chunks) {
				controller.enqueue(new Uint8Array(chunk));
			}

			controller.close();
		},
	});
}

function createEmptyStream() {
	return new ReadableStream({
		start(controller) {
			controller.close();
		},
	});
}

// StreamToString tests

test('streamToString - single string chunk', async t => {
	const stream = createStringStream('hello');
	const result = await streamToString(stream);
	t.is(result, 'hello');
});

test('streamToString - multiple string chunks', async t => {
	const stream = createStringStream('hello', ' ', 'world');
	const result = await streamToString(stream);
	t.is(result, 'hello world');
});

test('streamToString - Uint8Array chunks', async t => {
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(encoder.encode('hello'));
			controller.enqueue(encoder.encode(' world'));
			controller.close();
		},
	});
	const result = await streamToString(stream);
	t.is(result, 'hello world');
});

test('streamToString - empty stream', async t => {
	const stream = createEmptyStream();
	const result = await streamToString(stream);
	t.is(result, '');
});

test('streamToString - unicode content', async t => {
	const stream = createStringStream('hello ', '\u{1F600}', ' world');
	const result = await streamToString(stream);
	t.is(result, 'hello \u{1F600} world');
});

// StreamToUint8Array tests

test('streamToUint8Array - single chunk', async t => {
	const stream = createByteStream([1, 2, 3]);
	const result = await streamToUint8Array(stream);
	t.deepEqual(result, new Uint8Array([1, 2, 3]));
});

test('streamToUint8Array - multiple chunks', async t => {
	const stream = createByteStream([1, 2], [3, 4], [5]);
	const result = await streamToUint8Array(stream);
	t.deepEqual(result, new Uint8Array([1, 2, 3, 4, 5]));
});

test('streamToUint8Array - empty stream', async t => {
	const stream = createEmptyStream();
	const result = await streamToUint8Array(stream);
	t.deepEqual(result, new Uint8Array([]));
});

test('streamToUint8Array - string chunks are encoded', async t => {
	const stream = createStringStream('hi');
	const result = await streamToUint8Array(stream);
	t.deepEqual(result, new TextEncoder().encode('hi'));
});

test('streamToUint8Array - large chunks', async t => {
	const big = Array.from({length: 1000}, (_, i) => i % 256);
	const stream = createByteStream(big);
	const result = await streamToUint8Array(stream);
	t.is(result.length, 1000);
	t.is(result[0], 0);
	t.is(result[999], 999 % 256);
});

// StreamToJson tests

test('streamToJson - valid JSON object', async t => {
	const stream = createStringStream('{"key":"value"}');
	const result = await streamToJson(stream);
	t.deepEqual(result, {key: 'value'});
});

test('streamToJson - JSON array', async t => {
	const stream = createStringStream('[1,2,3]');
	const result = await streamToJson(stream);
	t.deepEqual(result, [1, 2, 3]);
});

test('streamToJson - multi-chunk JSON', async t => {
	const stream = createStringStream('{"he', 'llo":', '"world"}');
	const result = await streamToJson(stream);
	t.deepEqual(result, {hello: 'world'});
});

test('streamToJson - JSON number', async t => {
	const stream = createStringStream('42');
	const result = await streamToJson(stream);
	t.is(result, 42);
});

test('streamToJson - JSON null', async t => {
	const stream = createStringStream('null');
	const result = await streamToJson(stream);
	t.is(result, null);
});

test('streamToJson - invalid JSON throws', async t => {
	const stream = createStringStream('not json');
	await t.throwsAsync(() => streamToJson(stream), {instanceOf: SyntaxError});
});

// StreamToArray tests

test('streamToArray - collects string chunks', async t => {
	const stream = createStringStream('a', 'b', 'c');
	const result = await streamToArray(stream);
	t.deepEqual(result, ['a', 'b', 'c']);
});

test('streamToArray - collects byte chunks', async t => {
	const stream = createByteStream([1], [2], [3]);
	const result = await streamToArray(stream);
	t.is(result.length, 3);
	t.deepEqual(result[0], new Uint8Array([1]));
	t.deepEqual(result[1], new Uint8Array([2]));
	t.deepEqual(result[2], new Uint8Array([3]));
});

test('streamToArray - empty stream returns empty array', async t => {
	const stream = createEmptyStream();
	const result = await streamToArray(stream);
	t.deepEqual(result, []);
});

test('streamToArray - single chunk', async t => {
	const stream = createStringStream('only');
	const result = await streamToArray(stream);
	t.deepEqual(result, ['only']);
});

test('streamToArray - preserves chunk types', async t => {
	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue('string');
			controller.enqueue(42);
			controller.enqueue(null);
			controller.close();
		},
	});
	const result = await streamToArray(stream);
	t.deepEqual(result, ['string', 42, null]);
});
