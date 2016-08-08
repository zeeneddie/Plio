if (Meteor.isServer) {
  import WorkItemWorkflow from './server/WorkItemWorkflow.js';
  export default WorkItemWorkflow;
} else {
  export default class WorkItemWorkflow { }
}
