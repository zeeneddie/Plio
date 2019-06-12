import { validate, required } from '../util';

export default validate({
  name: required('Org name'),
  template: required('Template'),
});
