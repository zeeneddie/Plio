import { Risks } from '/imports/share/collections/risks';
import ProblemWorkflow from './ProblemWorkflow';
import { ProblemTypes } from '/imports/share/constants.js';


export default class RiskWorkflow extends ProblemWorkflow {
  static get _collection() {
    return Risks;
  }

  static get _docType() {
    return ProblemTypes.RISK;
  }

}
