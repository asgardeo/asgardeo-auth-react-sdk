// jest.setup.js

// Polyfill for TextEncoder and TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// jest.setup.js

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
  