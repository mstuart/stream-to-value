/**
Consume a `ReadableStream` into a string.

@param {ReadableStream} readableStream - The stream to consume.
@returns {Promise<string>} The concatenated string content.
*/
export async function streamToString(readableStream) {
	const decoder = new TextDecoder();
	let result = '';

	for await (const chunk of readableStream) {
		result += typeof chunk === 'string' ? chunk : decoder.decode(chunk, {stream: true});
	}

	result += decoder.decode();

	return result;
}

/**
Consume a `ReadableStream` into a `Uint8Array`.

@param {ReadableStream} readableStream - The stream to consume.
@returns {Promise<Uint8Array>} The concatenated bytes.
*/
export async function streamToUint8Array(readableStream) {
	const chunks = [];
	let totalLength = 0;

	for await (const chunk of readableStream) {
		const bytes = typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk;
		chunks.push(bytes);
		totalLength += bytes.length;
	}

	const result = new Uint8Array(totalLength);
	let offset = 0;

	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}

	return result;
}

/**
Consume a `ReadableStream` and parse the content as JSON.

@param {ReadableStream} readableStream - The stream to consume.
@returns {Promise<unknown>} The parsed JSON value.
*/
export async function streamToJson(readableStream) {
	const string = await streamToString(readableStream);
	return JSON.parse(string);
}

/**
Consume a `ReadableStream` into an array of chunks.

@param {ReadableStream} readableStream - The stream to consume.
@returns {Promise<unknown[]>} An array of all chunks from the stream.
*/
export async function streamToArray(readableStream) {
	const chunks = [];

	for await (const chunk of readableStream) {
		chunks.push(chunk);
	}

	return chunks;
}
