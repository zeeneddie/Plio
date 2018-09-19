import {
  compose,
  join,
  flatten,
  juxt,
  prepend,
  append,
  of,
  length,
  ifElse,
  always,
  filter,
  whereEq,
} from 'ramda';

import { ImportanceValues, CustomerElementStatuses } from '../../../share/constants';

export const getCustomerElementInitialValues = () => ({
  title: '',
  description: '',
  importance: ImportanceValues[0],
});

export const getMatchText = compose(
  join(''),
  flatten,
  juxt([
    compose(
      prepend('('),
      of,
      length,
    ),
    compose(
      ifElse(
        length,
        compose(
          append(' matched'),
          prepend(', '),
          of,
          length,
        ),
        always(''),
      ),
      filter(whereEq({ status: CustomerElementStatuses.MATCHED })),
    ),
    always(')'),
  ]),
);
