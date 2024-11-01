// jest.setup.js

// Polyfill for TextEncoder and TextDecoder
const { TextEncoder, TextDecoder } = require('util');

global.crypto = { getRandomValues: (arr) => require('crypto').randomFillSync(arr) };

// Global definitions for TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock for Web Workers
class MockWorker {
    constructor(stringUrl) {
        this.url = stringUrl;
    }
    postMessage(msg) {
        console.log('Message posted to worker:', msg);
    }
    terminate() {
        console.log('Worker terminated');
    }
    addEventListener() {}
    removeEventListener() {}
}

global.Worker = MockWorker;
