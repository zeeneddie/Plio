import { Reviews } from '/imports/share/collections/reviews';
import BaseEntityService from '../base-entity-service.js';


export default {
  collection: Reviews,

  _service: new BaseEntityService(Reviews),

  insert(args) {
    return this._service.insert(args);
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
