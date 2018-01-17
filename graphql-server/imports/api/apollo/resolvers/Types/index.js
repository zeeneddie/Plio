import User from './User';
import Organization from './Organization';
import File from './File';

export default {
  ...User,
  ...Organization,
  ...File,
};
