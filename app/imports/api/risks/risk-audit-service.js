if (Meteor.isServer) {
  import RiskAuditService from './server/risk-audit-service.js';
  export default RiskAuditService;
} else {
  export default {};
}
