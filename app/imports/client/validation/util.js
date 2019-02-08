import { FORM_ERROR } from 'final-form';
import { forEachObjIndexed, curry, isNil, isEmpty, anyPass } from 'ramda';

const isNilOrEmpty = anyPass([isNil, isEmpty]);

export const required = curry((label, value) =>
  isNilOrEmpty(value) ? `${label} required` : undefined);

export const integer = curry((label, value) =>
  isNil(value) || Number.isInteger(value) ? undefined : `${label} must be an integer`);

export const createFormError = message => ({ [FORM_ERROR]: message });

export const combine = (rules, label) => (value) => {
  let message;

  rules.find((rule) => {
    message = rule(label, value);
    return !!message;
  });

  return message;
};

export const validate = rules => (values) => {
  const errors = new Set();

  forEachObjIndexed((value, key) => {
    if (rules[key]) {
      const error = rules[key](value, values);
      if (error) errors.add(error);
    }
  }, values);

  if (!errors.size) return undefined;

  return createFormError([...errors].join('\n'));
};
