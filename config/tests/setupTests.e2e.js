import { setDefaultOptions } from 'expect-puppeteer';

jest.setTimeout(180000);

Object.assign(process.env, {
  ROOT_URL: 'http://localhost:1337',
  DEFAULT_NAVIGATION_TIMEOUT: 180000,
});

setDefaultOptions({
  timeout: 5000,
});
