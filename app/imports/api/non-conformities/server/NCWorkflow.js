import { NonConformities } from '../non-conformities.js';

import ProblemWorkflow from '../../workflow-base/ProblemWorkflow.js';


export default class NCWorkflow extends ProblemWorkflow {

  static _collection() {
    return NonConformities;
  }

}
