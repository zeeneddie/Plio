import { validate, required } from '../util';

export default validate({
  title: required('Document title'),
  issueNumber: required('Issue number'),
});
