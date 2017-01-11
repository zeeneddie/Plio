import { NonConformities } from '/imports/share/collections/non-conformities';
import ProblemWorkflow from './ProblemWorkflow';


export default class NCWorkflow extends ProblemWorkflow {

  static get _collection() {
    return NonConformities;
  }

}
