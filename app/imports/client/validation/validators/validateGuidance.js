import { validate, required } from '../util';

export default validate({ title: required('Title'), html: required('Guidance') });
