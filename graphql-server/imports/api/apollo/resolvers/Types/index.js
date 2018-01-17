import User from './User';
import Organization from './Organization';
import File from './File';
import Action from './Action';

export default {
  ...User,
  ...Organization,
  ...File,
  ...Action,
};
