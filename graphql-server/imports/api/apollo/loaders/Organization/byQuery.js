import { createQueryLoader } from '../util';

export default ({ collections: { Organizations } }) => createQueryLoader(Organizations);
