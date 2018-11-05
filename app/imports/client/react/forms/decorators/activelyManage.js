import createDecorator from 'final-form-calculate';
import { compose, any, complement, length, props } from 'ramda';

export default createDecorator(
  {
    field: /goals|standards|risks|nonconformities|potentialGains|lessons/,
    updates: {
      shouldRenderActivelyManage: (value, allValues) => compose(
        any(complement(length)),
        props(['goals', 'standards', 'risks', 'nonconformities', 'potentialGains', 'lessons']),
      )(allValues),
    },
  },
);
