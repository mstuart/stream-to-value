<div align="center">
  <img src="docs/assets/logo.svg" alt="stream-to-value — Consume a Web ReadableStream into a string, Uint8Array, JSON object, or array of chunks" width="720">
</div>

<p align="center"><strong>Consume a Web ReadableStream into a string, Uint8Array, JSON object, or array of chunks</strong></p>

<p align="center">
  <a href="https://github.com/mstuart/stream-to-value/actions/workflows/main.yml"><img src="https://github.com/mstuart/stream-to-value/actions/workflows/main.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/stream-to-value"><img src="https://img.shields.io/npm/v/stream-to-value?label=npm" alt="npm"></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A520-339933.svg" alt="Node 20+">
</p>

---
## Install

```sh
npm install stream-to-value
```

## Usage

```js
import {streamToString, streamToJson} from 'stream-to-value';

const response = await fetch('https://example.com/api');

const text = await streamToString(response.body);
console.log(text);

const response2 = await fetch('https://example.com/api/data');

const data = await streamToJson(response2.body);
console.log(data);
```

## API

### streamToString(readableStream)

Consume a `ReadableStream` into a string. Handles both string and `Uint8Array` chunks.

Returns a `Promise<string>`.

#### readableStream

Type: `ReadableStream`

The stream to consume.

### streamToUint8Array(readableStream)

Consume a `ReadableStream` into a single `Uint8Array`.

Returns a `Promise<Uint8Array>`.

#### readableStream

Type: `ReadableStream`

The stream to consume.

### streamToJson(readableStream)

Consume a `ReadableStream` and parse the content as JSON.

Returns a `Promise<unknown>`.

#### readableStream

Type: `ReadableStream`

The stream to consume.

### streamToArray(readableStream)

Consume a `ReadableStream` into an array of chunks.

Returns a `Promise<unknown[]>`.

#### readableStream

Type: `ReadableStream`

The stream to consume.

## Related

- [web-streams-polyfill](https://github.com/AshleySetter/web-streams-polyfill) - Web Streams API polyfill

## License

MIT
