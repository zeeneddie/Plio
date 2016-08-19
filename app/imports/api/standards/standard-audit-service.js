if (Meteor.isServer) {
  import StandardAuditService from './server/standard-audit-service.js';
  export default StandardAuditService;
} else {
  export default {};
}
