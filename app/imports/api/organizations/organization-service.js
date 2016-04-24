import { Organizations } from './organizations.js';
import { UserRoles } from '../constants.js';


export default OrganizationService = {

  insert({ name, ownerId }) {
    const lastOrg = Organizations.findOne({
      serialNumber: {
        $type: 16 // 32-bit integer
      }
    }, {
      sort: {
        serialNumber: -1
      }
    });

    const serialNumber = lastOrg ? lastOrg.serialNumber + 1 : 100;

    return Organizations.insert({
      name,
      serialNumber,
      users: [{
        userId: ownerId,
        role: UserRoles.OWNER
      }]
    });
  },

  update() {

  },

  remove() {

  }

};
