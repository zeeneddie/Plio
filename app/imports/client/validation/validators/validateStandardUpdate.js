import { validate, required, integer, combine } from '../util';

export default validate({
  title: required('Document title'),
  issueNumber: combine([required, integer], 'Issue number'),
  uniqueNumber: integer('Unique number'),
});
