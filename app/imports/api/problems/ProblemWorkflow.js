if (Meteor.isServer) {
  import ProblemWorkflow from './server/ProblemWorkflow.js';
  export default ProblemWorkflow;
} else {
  export default class ProblemWorkflow { }
}
