module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/.claude/'],
  testPathIgnorePatterns: ['<rootDir>/.claude/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-safe-area-context|react-redux|@reduxjs/toolkit|redux-saga|styled-components)/)',
  ],
};
