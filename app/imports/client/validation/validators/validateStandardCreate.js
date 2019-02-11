import { validate, required, integer, combine } from '../util';

export default validate({
  title: required('Document title'),
  source1: required('Source file'),
  issueNumber: combine([required, integer], 'Issue number'),
});
