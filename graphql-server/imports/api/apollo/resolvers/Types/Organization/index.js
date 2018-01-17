import { loadUserById } from 'plio-util';
import { userId } from 'plio-util/dist/lenses';
import { view } from 'ramda';

export default {
  OrganizationUser: {
    user: loadUserById(view(userId)),
  },
};
