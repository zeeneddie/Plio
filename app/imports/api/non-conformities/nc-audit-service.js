if (Meteor.isServer) {
  import NCAuditService from './server/nc-audit-service.js';
  export default NCAuditService;
} else {
  export default {};
}
