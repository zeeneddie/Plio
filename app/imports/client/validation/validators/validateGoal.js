import { validate, required } from '../util';

export default validate({
  title: required('Key goal name'),
  endDate: required('End date'),
});
