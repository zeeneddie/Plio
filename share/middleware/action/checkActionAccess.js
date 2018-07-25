import { checkDocAccess } from '../document';

export default () => checkDocAccess((root, args, { collections: { Actions } }) => Actions);
