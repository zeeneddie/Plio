import { Helps } from '/imports/share/collections/helps';
import BaseEntityService from '../base-entity-service.js';


export default HelpService = {

  collection: Helps,

  _service: new BaseEntityService(Helps),

  insert({ ...args }) {
    return this.collection.insert(args);
  },

  update({ ...args }) {
    return this._service.update(args);
  },

  remove({ ...args }) {
    return this._service.remove(args);
  },

  restore({ ...args }) {
    return this._service.restore(args);
  },

};
