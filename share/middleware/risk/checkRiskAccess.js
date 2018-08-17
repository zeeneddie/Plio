import { checkDocAccess } from '../document';
import { Risks } from '../../../share/collections';

export default () => checkDocAccess(() => Risks);
