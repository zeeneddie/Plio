import { createHash } from 'crypto';
import { statSync } from 'fs';

export const createMd5Hash = (value) => createHash('md5')
  .update(value.toString())
  .digest('hex');

export const getCreatedFileTime = (path) => {
  return statSync(path).birthtime.getTime();
};

