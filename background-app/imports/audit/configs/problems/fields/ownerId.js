import ownerId from '../../common/fields/ownerId';


export default {
  field: 'ownerId',
  logs: [
    ownerId.logs.default,
  ],
  notifications: [
    ownerId.notifications.personal,
  ],
  data: ownerId.data,
};
