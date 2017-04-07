import { Standards } from '/imports/share/collections/standards.js';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import BaseEntityService from '../base-entity-service.js';
import NonConformityService from '../non-conformities/non-conformities-service';
import RiskService from '../risks/risks-service';

export default {
  collection: Standards,

  _service: new BaseEntityService(Standards),

  insert({ ...args }) {
    return this.collection.insert(args);
  },

  update({ ...args }) {
    return this._service.update({ ...args });
  },

  updateViewedBy({ _id, userId: viewedBy }) {
    return this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    return this._service.remove({ _id, deletedBy });
  },

  restore({ _id }) {
    return this._service.restore({ _id });
  },

  removePermanently({ _id, query }) {
    return this._service.removePermanently({ _id, query });
  },

  unlinkProblemDocs({ _id }) {
    const query = { standardsIds: _id };

    NonConformities.find(query).forEach((nc) => {
      NonConformityService.unlinkStandard({
        _id: nc._id,
        standardId: _id,
      });
    });

    Risks.find(query).forEach((risk) => {
      RiskService.unlinkStandard({
        _id: risk._id,
        standardId: _id,
      });
    });
  },

  getCount({ organizationId, isDeleted, limit }) {
    const query = { organizationId };
    const options = { fields: { _id: 1 } };

    if (typeof isDeleted !== 'undefined' && isDeleted !== null) {
      Object.assign(query, { isDeleted });
    }

    if (typeof limit !== 'undefined' && limit !== null) {
      Object.assign(options, { limit });
    }

    return this.collection.find(query, options).count();
  },
};
