if (Meteor.isServer) {
  import LessonAuditService from './server/lesson-audit-service.js';
  export default LessonAuditService;
} else {
  export default {};
}
