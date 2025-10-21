import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import { ReadableStream, TransformStream, WritableStream } from 'stream/web';
import { MessageChannel, MessagePort } from 'worker_threads';
import { createRequire } from 'module';

if (typeof global.TextEncoder === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.TextDecoder = TextDecoder;
}

if (typeof global.ReadableStream === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.ReadableStream = ReadableStream;
}

if (typeof global.WritableStream === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.WritableStream = WritableStream;
}

if (typeof global.TransformStream === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.TransformStream = TransformStream;
}

if (typeof global.MessageChannel === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.MessageChannel = MessageChannel;
}

if (typeof global.MessagePort === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.MessagePort = MessagePort;
}

const require = createRequire(import.meta.url);
const { fetch, Headers, Request, Response, FormData } = require('undici');

if (typeof global.fetch === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.fetch = fetch;
}

if (typeof global.Headers === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.Headers = Headers;
}

if (typeof global.Request === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.Request = Request;
}

if (typeof global.Response === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.Response = Response;
}

if (typeof global.FormData === 'undefined') {
  // @ts-expect-error Node test environment polyfill
  global.FormData = FormData;
}
