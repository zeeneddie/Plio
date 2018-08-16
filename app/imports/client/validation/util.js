import { FORM_ERROR } from 'final-form';
import { forEachObjIndexed, curry, isNil } from 'ramda';

export const required = curry((label, value) => !isNil(value) ? undefined : `${label} required`);

export const validate = rules => (values) => {
  const errors = new Set();

  forEachObjIndexed((value, key) => {
    if (rules[key]) {
      const error = rules[key](value, values);
      if (error) errors.add(error);
    }
  }, values);

  if (!errors.size) return undefined;

  return { [FORM_ERROR]: [...errors].join('\n') };
};
