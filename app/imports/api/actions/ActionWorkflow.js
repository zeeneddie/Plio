if (Meteor.isServer) {
  import ActionWorkflow from './server/ActionWorkflow.js';
  export default ActionWorkflow;
} else {
  export default class ActionWorkflow { }
}
