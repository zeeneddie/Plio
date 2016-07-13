import { Template } from 'meteor/templating';

import { Actions } from '/imports/api/actions/actions.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';

Template.Actions_Card_Read_Wrapper.viewmodel({
  mixin: ['action', 'utils', 'nonconformity', 'risk', 'organization'],
  _is_(name) {
    const collection = this.getCollectionInstance(this.actionId(), Actions, NonConformities, Risks);
    return collection && collection._name === name;
  },
  NC() {
    return this._getNCByQuery({ _id: this.actionId() });
  },
  risk() {
    return this._getRiskByQuery({ _id: this.actionId() });
  }
});
