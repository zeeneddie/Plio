import { Risks } from '/imports/share/collections/risks';
import ProblemWorkflow from './ProblemWorkflow';


export default class RiskWorkflow extends ProblemWorkflow {
  static get _collection() {
    return Risks;
  }
}
