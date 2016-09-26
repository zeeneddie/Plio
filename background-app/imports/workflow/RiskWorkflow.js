import { Risks } from '/imports/share/collections/risks.js';

import ProblemWorkflow from './ProblemWorkflow.js';


export default class RiskWorkflow extends ProblemWorkflow {

  static _collection() {
    return Risks;
  }

}
