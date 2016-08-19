if (Meteor.isServer) {
  import OccurenceAuditService from './server/occurrence-audit-service.js';
  export default OccurenceAuditService;
} else {
  export default {};
}
