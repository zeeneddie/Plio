import { Risks } from '../risks.js';

import ProblemWorkflow from '../../workflow-base/ProblemWorkflow.js';


export default class RiskWorkflow extends ProblemWorkflow {

  static _collection() {
    return Risks;
  }

}
