/* eslint-disable @typescript-eslint/no-require-imports */

const packageJson = require('../../package.json') as {version?: string};

export const APP_VERSION = packageJson.version ?? '0.0.1';
