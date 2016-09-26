import { NonConformities } from '/imports/share/collections/non-conformities.js';

import ProblemWorkflow from './ProblemWorkflow.js';


export default class NCWorkflow extends ProblemWorkflow {

  static _collection() {
    return NonConformities;
  }

}
