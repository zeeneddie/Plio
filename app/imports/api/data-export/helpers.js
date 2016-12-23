import { createHash } from 'crypto';
import { statSync } from 'fs';

export const createMd5Hash = (value) => createHash('md5')
  .update(value.toString())
  .digest('hex');

export const getLastModifiedFileTime = (path) => statSync(path).mtime.getTime();
