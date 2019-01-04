import { createQueryLoader } from '../util';

export default ({ collections: { Files } }) => createQueryLoader(Files);
