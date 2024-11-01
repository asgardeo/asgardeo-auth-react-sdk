// jest.setup.js

// Polyfill for TextEncoder and TextDecoder
const { TextEncoder, TextDecoder } = require('util');

// Mock the crypto object
global.crypto = {
    getRandomValues: (arr) => {
        // Fill the array with random values for testing
        if (arr instanceof Uint8Array) {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = Math.floor(Math.random() * 256);
            }
        }
        return arr;
    },
};

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
