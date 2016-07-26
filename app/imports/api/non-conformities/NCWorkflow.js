if (Meteor.isServer) {
  import NCWorkflow from './server/NCWorkflow.js';
  export default NCWorkflow;
} else {
  export default class NCWorkflow { }
}
