if (Meteor.isServer) {
  import ActionAuditService from './server/action-audit-service.js';
  export default ActionAuditService;
} else {
  export default {};
}
