import { NonConformities } from '../non-conformities.js';

import ProblemWorkflow from '../../problems/ProblemWorkflow.js';


export default class NCWorkflow extends ProblemWorkflow {

  static _collection() {
    return NonConformities;
  }

}
