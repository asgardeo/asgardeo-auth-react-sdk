// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',               // Ensure jsdom environment
    setupFilesAfterEnv: ['./jest.setup.js'], // Load jest.setup.js
  };
  