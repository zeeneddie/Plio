import { Organizations } from '/imports/share/collections/organizations';
import { Reviews } from '/imports/share/collections/reviews';
import { getDocByIdAndType, getReviewConfig } from '/imports/share/helpers';
import BaseEntityService from '/imports/share/services/base-entity-service.js';
import ReviewWorkflow from '/imports/share/utils/ReviewWorkflow';


export default {
  collection: Reviews,

  _service: new BaseEntityService(Reviews),

  insert({ documentId, documentType, ...args }) {
    const linkedDoc = getDocByIdAndType(documentId, documentType);
    const organization = Organizations.findOne({
      _id: linkedDoc.organizationId,
    });
    const reviewConfig = getReviewConfig(organization, documentType);
    const reviewWorkflow = new ReviewWorkflow(linkedDoc, reviewConfig, organization.timezone);

    return this._service.insert({
      scheduledDate: reviewWorkflow.getReviewSchedule(),
      documentId,
      documentType,
      ...args,
    });
  },

  update(args) {
    return this._service.update(args);
  },

  updateViewedBy(args) {
    return this._service.updateViewedBy(args);
  },

  remove(args) {
    return this._service.removePermanently(args);
  },
};
