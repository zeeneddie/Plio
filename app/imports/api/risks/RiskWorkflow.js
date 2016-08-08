if (Meteor.isServer) {
  import RiskWorkflow from './server/RiskWorkflow.js';
  export default RiskWorkflow;
} else {
  export default class RiskWorkflow { }
}
