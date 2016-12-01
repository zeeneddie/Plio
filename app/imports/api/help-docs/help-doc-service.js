import { HelpDocs } from '/imports/share/collections/help-docs';
import BaseEntityService from '../base-entity-service.js';


export default HelpDocService = {

  collection: HelpDocs,

  _service: new BaseEntityService(HelpDocs),

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
