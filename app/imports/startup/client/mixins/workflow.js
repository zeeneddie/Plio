import { ProblemMagnitudes } from '/imports/api/constants.js';
import { getDocumentCollectionByType } from '/imports/api/helpers.js';

export default {

  // linkedTo is an array of objects
  getWorkflowDefaultStepDate({ organization, linkedTo }) {
    let magnitude = ProblemMagnitudes.MINOR;

    // Select the highest magnitude among all linked documents
    _.each(linkedTo, ({ documentId, documentType }) => {
      const collection = getDocumentCollectionByType(documentType);
      const doc = collection.findOne({ _id: documentId });
      if (magnitude === ProblemMagnitudes.CRITICAL) {
        return;
      }

      if (doc.magnitude === ProblemMagnitudes.MINOR) {
        return;
      }

      magnitude = doc.magnitude;
    });

    const workflowStepTime = organization.workflowStepTime(magnitude);
    const { timeValue, timeUnit } = workflowStepTime;
    const date = moment().add(timeValue, timeUnit).toDate();

    return date;
  }
};
