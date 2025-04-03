// ReadableStream polyfill for Node.js < 18
const { ReadableStream } = require('web-streams-polyfill/ponyfill');

if (typeof globalThis.ReadableStream === 'undefined') {
  globalThis.ReadableStream = ReadableStream;
} 