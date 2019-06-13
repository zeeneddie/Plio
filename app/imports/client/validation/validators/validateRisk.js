import { validate, required } from '../util';

export default validate({
  title: required('Risk name'),
  type: required('Risk type'),
});
