import { NonConformities } from '/imports/share/collections/non-conformities';
import ProblemWorkflow from './ProblemWorkflow';
import { ProblemTypes } from '/imports/share/constants.js';


export default class NCWorkflow extends ProblemWorkflow {
  static get _collection() {
    return NonConformities;
  }

  static get _docType() {
    return ProblemTypes.NON_CONFORMITY;
  }

}
