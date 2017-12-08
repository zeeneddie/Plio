import { Risks } from '/imports/share/collections/risks';
import ProblemWorkflow from './ProblemWorkflow';
import { ProblemTypes } from '/imports/share/constants.js';


export default class RiskWorkflow extends ProblemWorkflow {
  static get _collection() {
    return Risks;
  }
<<<<<<< HEAD
=======

  static get _docType() {
    return ProblemTypes.RISK;
  }

>>>>>>> d9bedfa586277a878b2e425b1cdf3771f9696b17
}
