import { checkDocAccess } from '../document';
import { Milestones } from '../../../share/collections';

export default () => checkDocAccess(() => Milestones);
