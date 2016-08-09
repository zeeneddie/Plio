import { CollectionNames } from '../constants.js';
import ProblemUpdateAudit from '../problems/ProblemUpdateAudit.js';


export default class NCUpdateAudit extends ProblemUpdateAudit {

  static get _collection() {
    return CollectionNames.NCS;
  }

}
