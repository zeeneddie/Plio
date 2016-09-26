import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import invoke from 'lodash.invoke';

import { ActionPlanOptions } from '/imports/api/constants.js';
import { insert } from '/imports/api/actions/methods.js';
import { Actions } from '/imports/api/actions/actions.js';
import { getTzTargetDate, getWorkflowDefaultStepDate, setModalError, inspire } from '/imports/api/helpers.js';
import { WorkItems } from '/imports/api/work-items/work-items.js';

Template.Actions_Create.viewmodel({
  mixin: ['workInbox', 'organization', 'router', 'getChildrenData'],
  type: '',
  title: '',
  ownerId() { return Meteor.userId() },
  planInPlace: ActionPlanOptions.NO,
  completionTargetDate() {
    const organization = this.organization();
    const linkedToVM = this.child('Actions_LinkedTo_Edit');
    const linkedTo = linkedToVM && linkedToVM.linkedTo() || [];

    return getWorkflowDefaultStepDate({ organization, linkedTo });
  },
  toBeCompletedBy: Meteor.userId(),
  verificationTargetDate: '',
  toBeVerifiedBy: '',
  save() {
    const data = this.getData();

    for (let key in data) {
      if (!data[key]) {
        const errorMessage = `The new action cannot be created without a ${key}. Please enter a ${key} for your action.`;
        setModalError(errorMessage);
        return;
      }
    }

    this.insert(data);
  },
  insert({ completionTargetDate, ...args }) {
    const { organizationId, organization = {} } = inspire(['organization', 'organizationId'], this);
    const { type } = this.data();

    const { timezone } = organization;
    const tzDate = getTzTargetDate(completionTargetDate, timezone);

    const allArgs = {
      ...args,
      type,
      organizationId,
      completionTargetDate: tzDate
    };

    const cb = (_id, open) => {
      const action = this._getActionByQuery({ _id });
      const workItem = this._getWorkItemByQuery({ 'linkedDoc._id': _id });
      const queryParams = this._getQueryParams(workItem)(Meteor.userId());

      workItem && this.goToWorkItem(workItem._id, queryParams);

      open({
        _id,
        _title: action ? this._getNameByType(action.type) : '',
        template: 'Actions_Edit'
      });
    };

    return invoke(this.card, 'insert', insert, allArgs, cb);
  },
  getData() {
    return this.getChildrenData();
  }
});
