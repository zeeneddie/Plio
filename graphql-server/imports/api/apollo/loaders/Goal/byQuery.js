import { createQueryLoader } from '../util';

// TODO: use dataloader's prime on byId loader
export default ({ collections: { Goals } }) => createQueryLoader(Goals);
