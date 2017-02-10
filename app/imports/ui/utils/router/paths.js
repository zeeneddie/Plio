import { createPathGetter } from './helpers';
import { PATH_MAP } from './constants';

export const paths = Object.keys(PATH_MAP).reduce((prev, path) =>
  ({
    ...prev,
    [path]: createPathGetter(path, PATH_MAP[path].orgSerialNumber, PATH_MAP[path].filter),
  }), {});

export const getPath = name => paths[name];
