import '@testing-library/jest-dom';

if (!global.TextEncoder) {
  global.TextEncoder = require('util').TextEncoder;
  global.TextDecoder = require('util').TextDecoder;
}
