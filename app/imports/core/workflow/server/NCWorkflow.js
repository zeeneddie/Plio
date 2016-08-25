import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';

import ProblemWorkflow from './ProblemWorkflow.js';


export default class NCWorkflow extends ProblemWorkflow {

  static _collection() {
    return NonConformities;
  }

}
